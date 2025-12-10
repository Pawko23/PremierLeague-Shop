// client/src/components/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types/models';
import './styles/ProductCard.scss';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    // Zakładamy, że pierwszy wariant (home lub away) jest domyślnie wyświetlany
    const defaultVariant = product.variants[0];
    const imageUrl = defaultVariant?.images[0] || 'default-placeholder.jpg';

    return (
        <div className="product-card">
            <Link to={`/product/${product.slug}`}>
                <img src={imageUrl} alt={product.name} className="product-card__image" />
                <h3 className="product-card__name">{product.name}</h3>
            </Link>
            <p className="product-card__club">{product.club}</p>
            <p className="product-card__price">{product.price.toFixed(2)} PLN</p>
            <Link to={`/product/${product.slug}`} className="product-card__button">
                Zobacz szczegóły
            </Link>
        </div>
    );
};

export default ProductCard;