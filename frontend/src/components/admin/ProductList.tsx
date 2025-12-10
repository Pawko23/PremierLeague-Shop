// client/src/components/admin/ProductList.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import type { Product } from '../../types/models';
import './styles/ProductList.scss';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Używamy publicznego endpointu do pobrania listy (dla uproszczenia)
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (err) {
            console.error("Błąd pobierania produktów do zarządzania:", err);
            setError("Nie udało się pobrać listy produktów.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Czy na pewno chcesz usunąć produkt: "${name}"?`)) {
            return;
        }

        try {
            // DELETE /api/admin/products/:id (chroniony tokenem admina)
            await api.delete(`/admin/products/${id}`);
            alert(`Produkt "${name}" usunięty pomyślnie.`);
            fetchProducts(); // Odśwież listę
        } catch (err) {
            console.error("Błąd usuwania produktu:", err);
            alert("Błąd podczas usuwania produktu.");
        }
    };

    if (loading) return <div>Ładowanie produktów do zarządzania...</div>;
    if (error) return <div>Błąd: {error}</div>;

    return (
        <div className="admin-product-list">
            <h3>Lista Produktów ({products.length})</h3>
            
            {products.length === 0 ? (
                <div className="no-products-message">
                    <p>Brak produktów. Kliknij "Dodaj Nowy Produkt", aby zacząć.</p>
                </div>
            ) : (
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Nazwa</th>
                            <th>Klub</th>
                            <th>Cena</th>
                            <th>Dostępny (SUMA)</th>
                            <th>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => {
                            // Obliczanie sumy dostępnych sztuk
                            const totalStock = Object.values(product.stock.home).reduce((sum, count) => sum + count, 0) +
                                             Object.values(product.stock.away).reduce((sum, count) => sum + count, 0);
                            
                            return (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.club}</td>
                                    <td>{product.price.toFixed(2)} PLN</td>
                                    <td>{totalStock}</td>
                                    <td>
                                        <Link to={`edit/${product.id}`} className="action-button action-button--edit">Edytuj</Link>
                                        <button 
                                            onClick={() => handleDelete(product.id, product.name)}
                                            className="action-button action-button--delete"
                                        >
                                            Usuń
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProductList;