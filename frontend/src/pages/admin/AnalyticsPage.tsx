// client/src/pages/admin/AnalyticsPage.tsx
import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import type { AnalyticsData } from '../../types/models';
import './styles/AnalyticsPage.scss';

const AnalyticsPage: React.FC = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                // GET /api/admin/analytics (wymaga roli admina)
                const response = await api.get('/admin/analytics');
                setAnalytics(response.data);
                setError(null);
            } catch (err) {
                console.error("Błąd pobierania analityki:", err);
                setError("Nie udało się załadować danych analitycznych.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <div>Ładowanie statystyk...</div>;
    if (error) return <div>Błąd: {error}</div>;
    if (!analytics) return <div>Brak danych do wyświetlenia.</div>;

    return (
        <div className="analytics-page">
            <h2>Statystyki Sklepu</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h4>Łącznie Zamówień</h4>
                    <p>{analytics.totalOrders}</p>
                </div>
                <div className="stat-card">
                    <h4>Łączny Przychód</h4>
                    <p>{analytics.totalRevenue.toFixed(2)} PLN</p>
                </div>
                <div className="stat-card">
                    <h4>Sprzedanych Produktów</h4>
                    <p>{analytics.totalSoldProducts}</p>
                </div>
            </div>

            <h3 className="top-products-title">Top 5 Najlepiej Sprzedających Się Produktów</h3>
            <ol className="top-products-list">
                {analytics.top5Products.map((p, index) => (
                    <li key={index}>{p.name} ({p.quantity} szt.)</li>
                ))}
            </ol>
        </div>
    );
};

export default AnalyticsPage;