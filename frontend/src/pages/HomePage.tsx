// client/src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import api from '../api/client';
import type { Product } from '../types/models';
import ProductCard from '../components/ProductCard'; 
import ProductFilters from '../components/ProductFilters';
import './styles/HomePage.scss';

const HomePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({}); // Stan dla filtrów

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Filtry jako parametry zapytania
                const response = await api.get('/products', { params: filters });
                setProducts(response.data);
                setError(null);
            } catch (err) {
                console.error("Błąd pobierania produktów:", err);
                setError("Nie udało się pobrać listy produktów.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters]); // Pobieranie produktów po zmianie filtrów

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
    };

    if (loading) return (
        <div className="homepage-status">
            <h1>Ładowanie produktów...</h1>
            <p>Sprawdzam dostępność koszulek Premier League.</p>
        </div>
    );
    if (error) return (
        <div className="homepage-status homepage-status--error">
            <h1>Błąd ładowania sklepu 😔</h1>
            <p>{error}</p>
            <p>Jeśli problem będzie się powtarzał, skontaktuj się z administratorem.</p>
            {/* Dodanie opcjonalnego przycisku odświeżania */}
            <button onClick={() => window.location.reload()}>Spróbuj ponownie</button>
        </div>
    );
    if (products.length === 0) return (
         <div className="homepage-status">
            <h1>Brak dostępnych produktów</h1>
            <p>Wygląda na to, że administrator nie dodał jeszcze żadnych koszulek lub filtry są zbyt restrykcyjne.</p>
            {/* Tutaj można wyświetlić przycisk do resetowania filtrów */}
        </div>
    );

return (
        <div className="homepage">
            <h1>Premier League Jerseys Shop</h1>
            <ProductFilters onFilterChange={handleFilterChange} />
            <div className="product-grid">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;