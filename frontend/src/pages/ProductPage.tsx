// client/src/pages/ProductPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import type { Product, ProductVariant, TshirtSize, VariantType } from '../types/models';
import { useCart } from '../context/CartContext';
import './styles/ProductPage.scss';

const ProductPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Stany dla wyboru wariantu i rozmiaru
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [selectedSize, setSelectedSize] = useState<TshirtSize | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/products/slug/${slug}`);
                const fetchedProduct: Product = response.data;
                
                if (!fetchedProduct) {
                    setError("Produkt nie znaleziony.");
                    setLoading(false);
                    return;
                }

                setProduct(fetchedProduct);
                // Ustaw domyślny wariant i rozmiar
                setSelectedVariant(fetchedProduct.variants[0]);
                setSelectedSize(fetchedProduct.sizes[0]); 
                setError(null);
            } catch (err) {
                setError("Nie udało się pobrać szczegółów produktu.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    const handleAddToCart = () => {
        if (!product || !selectedVariant || !selectedSize) {
            alert("Proszę wybrać wariant i rozmiar.");
            return;
        }
        
        // Sprawdzenie dostępności w magazynie
        const stock = product.stock[selectedVariant.type]?.[selectedSize];
        if (!stock || stock < quantity) {
            alert(`Przepraszamy, dostępnych jest tylko ${stock || 0} sztuk tego wariantu/rozmiaru.`);
            return;
        }

        const itemToAdd = {
            productId: product.id,
            name: product.name,
            price: product.price,
            size: selectedSize,
            variantType: selectedVariant.type,
            imageUrl: selectedVariant.images[0] || 'default-placeholder.jpg',
        };

        addItem(itemToAdd, quantity);
        alert(`${quantity}x ${product.name} dodano do koszyka!`);
    };

    if (loading) return <div>Ładowanie...</div>;
    if (error) return <div>Błąd: {error}</div>;
    if (!product) return <div>Produkt nie znaleziony.</div>;

    const availableStock = selectedVariant && selectedSize 
        ? product.stock[selectedVariant.type]?.[selectedSize] || 0
        : 0;

    return (
        <div className="product-detail">
            <div className="product-detail__gallery">
                {selectedVariant?.images.map((url, index) => (
                    <img key={index} src={url} alt={`${product.name} ${selectedVariant.type}`} />
                ))}
            </div>

            <div className="product-detail__info">
                <h1>{product.name} - {product.club}</h1>
                <p className="product-detail__price">{product.price.toFixed(2)} PLN</p>
                
                <p>{product.description}</p>

                {/* Wybór Wariantu */}
                <div className="variants-selector">
                    <h3>Wariant:</h3>
                    {product.variants.map(variant => (
                        <button
                            key={variant.type}
                            onClick={() => setSelectedVariant(variant)}
                            className={selectedVariant?.type === variant.type ? 'active' : ''}
                        >
                            {variant.type.charAt(0).toUpperCase() + variant.type.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Wybór Rozmiaru */}
                <div className="sizes-selector">
                    <h3>Rozmiar:</h3>
                    {product.sizes.map(size => {
                        const isAvailable = selectedVariant && product.stock[selectedVariant.type]?.[size] > 0;
                        return (
                            <button
                                key={size}
                                onClick={() => isAvailable && setSelectedSize(size)}
                                className={selectedSize === size ? 'active' : ''}
                                disabled={!isAvailable}
                            >
                                {size} {isAvailable ? '' : '(Brak)'}
                            </button>
                        );
                    })}
                </div>
                
                <p className="product-detail__stock">Dostępność: {availableStock} szt.</p>

                {/* Ilość */}
                <input 
                    type="number" 
                    value={quantity} 
                    min="1" 
                    max={availableStock}
                    onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 1, availableStock))} 
                    disabled={availableStock === 0}
                />

                {/* Dodaj do koszyka */}
                <button 
                    onClick={handleAddToCart} 
                    disabled={!selectedVariant || !selectedSize || availableStock === 0}
                >
                    Dodaj do koszyka
                </button>
            </div>
        </div>
    );
};

export default ProductPage;