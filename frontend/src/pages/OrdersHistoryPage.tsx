// client/src/pages/OrdersHistoryPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import type { Order } from '../types/models';
import { useAuth } from '../context/AuthContext';
import './styles/OrdersHistoryPage.scss'; // Wymaga istnienia tego pliku SCSS

const OrdersHistoryPage: React.FC = () => {
    const { user, idToken } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Nie musimy sprawdzać idToken, ponieważ PrivateRoute i Interceptor API to robią, 
        // ale sprawdzamy, czy user istnieje.
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            try {
                // GET /api/orders (chroniony tokenem; backend filtruje po user.uid)
                const response = await api.get('/orders');
                setOrders(response.data);
                setError(null);
            } catch (err: any) {
                console.error("Błąd pobierania historii zamówień:", err);
                // Błąd może oznaczać, że user nie ma jeszcze zamówień lub błąd serwera.
                setError(err.response?.data?.message || "Nie udało się pobrać historii zamówień.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) return <div>Ładowanie historii zamówień...</div>;
    if (error && orders.length === 0) return <div>Błąd: {error}</div>; // Wyświetlamy błąd, jeśli nie ma danych
    if (orders.length === 0) return (
        <div className="orders-history--empty">
            <h1>Nie masz jeszcze żadnych zamówień 👕</h1>
            <p>Możesz przeglądać produkty w naszym sklepie i złożyć pierwsze zamówienie.</p>
            <Link to="/">Wróć do sklepu</Link>
        </div>
    );

    return (
        <div className="orders-history">
            <h1>Twoja Historia Zamówień</h1>
            
            {orders.map(order => (
                <div key={order.id} className={`order-card order-card--${order.status}`}>
                    <div className="order-card__header">
                        <span>Zamówienie #{order.id}</span>
                        <span>Data: {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="order-card__details">
                        <p>Status: <span className="order-card__status">{order.status.toUpperCase()}</span></p>
                        <p>Wartość: <strong>{order.totalAmount.toFixed(2)} PLN</strong></p>
                    </div>

                    <ul className="order-card__items-list">
                        {order.items.map((item, index) => (
                            <li key={index}>
                                {item.quantity}x {item.productName} ({item.variantType.toUpperCase()}, {item.size})
                            </li>
                        ))}
                    </ul>
                    {/* W projekcie akademickim pomijamy szczegóły zamówienia (/api/orders/:id) */}
                </div>
            ))}
        </div>
    );
};

export default OrdersHistoryPage;