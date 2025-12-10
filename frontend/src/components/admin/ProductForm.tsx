// client/src/components/admin/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/client';
import type { Product, TshirtSize, VariantType } from '../../types/models';
import './styles/ProductForm.scss';

interface ProductFormProps {
    mode: 'create' | 'edit';
}

const initialProductState: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'slug'> = {
    name: '',
    description: '',
    price: 0,
    club: '',
    season: '',
    // Warianty domyślne, z pustym URL obrazu (dla home i away)
    variants: [
        { type: 'home' as VariantType, images: [''], sku: '' },
        { type: 'away' as VariantType, images: [''], sku: '' },
    ],
    sizes: ['S' as TshirtSize, 'M' as TshirtSize, 'L' as TshirtSize, 'XL' as TshirtSize],
    stock: {
        home: { S: 0, M: 0, L: 0, XL: 0 },
        away: { S: 0, M: 0, L: 0, XL: 0 },
    },
};

const ProductForm: React.FC<ProductFormProps> = ({ mode }) => {
    const [productData, setProductData] = useState(initialProductState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Logika ładowania produktu do edycji (pobiera dane z backendu)
    useEffect(() => {
        if (mode === 'edit' && id) {
            const fetchProduct = async () => {
                setLoading(true);
                try {
                    // Endpoint GET /api/products/:id jest publiczny
                    const response = await api.get(`/products/${id}`);
                    const fetchedProduct: Product = response.data;
                    
                    // Mapowanie danych do stanu, z uwzględnieniem pustych pól
                    setProductData({
                        name: fetchedProduct.name || '',
                        description: fetchedProduct.description || '',
                        price: fetchedProduct.price || 0,
                        club: fetchedProduct.club || '',
                        season: fetchedProduct.season || '',
                        variants: fetchedProduct.variants as any,
                        sizes: fetchedProduct.sizes,
                        stock: fetchedProduct.stock,
                    });
                } catch (err) {
                    setError('Nie udało się załadować produktu do edycji.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        } else if (mode === 'create') {
             // Resetowanie stanu przy tworzeniu
             setProductData(initialProductState);
        }
    }, [mode, id]);

    // Obsługa zmian w polach tekstowych/liczbowych
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value,
        }));
    };

    // Obsługa zmian stanu magazynowego
    const handleStockChange = (variant: VariantType, size: TshirtSize, value: number) => {
        const validatedValue = Math.max(0, value); // Stan magazynowy nie może być ujemny
        setProductData(prev => ({
            ...prev,
            stock: {
                ...prev.stock,
                [variant]: {
                    ...prev.stock[variant],
                    [size]: validatedValue,
                },
            },
        }));
    };

    // Obsługa zmian URL-i zdjęć w wariantach
    const handleVariantImageChange = (variantIndex: number, imageIndex: number, value: string) => {
        const newVariants = [...productData.variants];
        if (newVariants[variantIndex].images[imageIndex] !== undefined) {
             newVariants[variantIndex].images[imageIndex] = value;
        } else {
             // To powinno się zdarzyć tylko, jeśli dodajemy nowe pole
             newVariants[variantIndex].images.push(value);
        }
        
        setProductData(prev => ({ ...prev, variants: newVariants as any }));
    };
    
    // Dodanie dodatkowego pola URL dla obrazu
    const addImageField = (variantIndex: number) => {
        const newVariants = [...productData.variants];
        // Dodajemy pusty string jako nowe pole URL
        newVariants[variantIndex].images.push(''); 
        setProductData(prev => ({ ...prev, variants: newVariants as any }));
    };

    // Usunięcie pola URL
    const removeImageField = (variantIndex: number, imageIndex: number) => {
        if (productData.variants[variantIndex].images.length <= 1) {
            alert("Każdy wariant musi mieć co najmniej jeden URL obrazu.");
            return;
        }
        const newVariants = [...productData.variants];
        newVariants[variantIndex].images.splice(imageIndex, 1);
        setProductData(prev => ({ ...prev, variants: newVariants as any }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const endpoint = mode === 'create' ? '/admin/products' : `/admin/products/${id}`;
        const method = mode === 'create' ? api.post : api.put;

        try {
            // Wysłanie danych do Nest.js
            await method(endpoint, productData);
            alert(`Produkt ${mode === 'create' ? 'dodany' : 'zaktualizowany'} pomyślnie!`);
            navigate('/admin/products');
        } catch (err: any) {
            console.error("Błąd zapisu produktu:", err.response?.data);
            setError(err.response?.data?.message || 'Wystąpił błąd podczas zapisu produktu. Sprawdź, czy wszystkie URL są poprawne.');
        } finally {
            setLoading(false);
        }
    };
    
    if (loading && mode === 'edit') return <div>Ładowanie danych produktu...</div>;
    if (error) return <div>Błąd: {error}</div>;

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <h3>{mode === 'create' ? 'Dodaj Nowy Produkt' : `Edytuj Produkt: ${productData.name}`}</h3>
            
            {/* Podstawowe Info */}
            <label>Nazwa:</label>
            <input type="text" name="name" value={productData.name} onChange={handleChange} required />

            <label>Klub (np. Manchester United):</label>
            <input type="text" name="club" value={productData.club} onChange={handleChange} required />
            
            <label>Cena (PLN):</label>
            <input type="number" name="price" value={productData.price} onChange={handleChange} min="0.01" step="0.01" required />

            <label>Sezon (opcjonalnie):</label>
            <input type="text" name="season" value={productData.season} onChange={handleChange} />

            <label>Opis:</label>
            <textarea name="description" value={productData.description} onChange={handleChange} required />

            {/* Warianty (Home/Away) */}
            <h4>Warianty, Zdjęcia (URL) i Stany Magazynowe</h4>
            {productData.variants.map((variant, vIndex) => (
                <div key={vIndex} className="variant-group">
                    <h5>{variant.type.toUpperCase()}</h5>
                    
                    <label>SKU (dla wariantu {variant.type}):</label>
                    <input 
                        type="text" 
                        value={variant.sku} 
                        onChange={(e) => {
                            const newVariants = [...productData.variants];
                            newVariants[vIndex].sku = e.target.value;
                            setProductData(prev => ({ ...prev, variants: newVariants as any }));
                        }}
                        required
                    />

                    {/* URL-e Zdjęć (Admin musi wkleić link) */}
                    <label>URL Obrazów (Publiczne Linki):</label>
                    {variant.images.map((url, imgIndex) => (
                         <div key={imgIndex} className="image-url-field">
                            <input 
                                type="url" 
                                value={url} 
                                placeholder={`URL Obrazu ${imgIndex + 1}`}
                                onChange={(e) => handleVariantImageChange(vIndex, imgIndex, e.target.value)}
                                required={imgIndex === 0} // Wymagany co najmniej jeden obraz
                            />
                            {variant.images.length > 1 && (
                                <button type="button" onClick={() => removeImageField(vIndex, imgIndex)} className="remove-image-button">
                                    X
                                </button>
                            )}
                         </div>
                    ))}
                    <button type="button" onClick={() => addImageField(vIndex)} className="add-image-button">
                        + Dodaj kolejny URL
                    </button>
                    
                    {/* Stany Magazynowe */}
                    <h6>Stan Magazynowy dla {variant.type.toUpperCase()}</h6>
                    <div className="stock-grid">
                        {productData.sizes.map(size => (
                            <div key={size} className="stock-item">
                                <label>{size}</label>
                                <input 
                                    type="number" 
                                    min="0"
                                    value={productData.stock[variant.type]?.[size] || 0}
                                    onChange={(e) => handleStockChange(variant.type, size, parseInt(e.target.value) || 0)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <button type="submit" disabled={loading}>
                {loading ? 'Zapisywanie...' : (mode === 'create' ? 'Dodaj Produkt' : 'Zapisz Zmiany')}
            </button>
            <button type="button" onClick={() => navigate('/admin/products')} className="back-button">
                Anuluj
            </button>
        </form>
    );
};

export default ProductForm;