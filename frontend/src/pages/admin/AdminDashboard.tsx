// client/src/pages/admin/AdminDashboard.tsx
import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom'; // Używamy NavLink dla klasy 'active'
import AnalyticsPage from './AnalyticsPage'; 
import ProductManagementPage from './ProductManagementPage'; 
import OrderManagementPage from './OrderManagementPage'; 
import './styles/AdminDashboard.scss'; 

const AdminDashboard: React.FC = () => {
    return (
        <div className="admin-dashboard">
            <h1>Panel Administratora</h1>
            <div className="admin-dashboard__layout">
                {/* Nawigacja Boczna */}
                <nav className="admin-dashboard__sidebar">
                    {/* NavLink automatycznie dodaje klasę 'active' */}
                    <NavLink to="/admin" end>Dashboard & Statystyki</NavLink>
                    <NavLink to="/admin/products">Zarządzanie Produktami</NavLink>
                    <NavLink to="/admin/orders">Zarządzanie Zamówieniami</NavLink>
                </nav>

                {/* Obszar Zawartości (Nested Routes) */}
                <div className="admin-dashboard__content">
                    {/* Uwaga: Routes działa dzięki temu, że główny App.tsx ma ścieżkę <Route path="/admin/*" ... */}
                    <Routes>
                        {/* Wersja bazowa z prostymi statystykami */}
                        <Route path="/" element={<AnalyticsPage />} /> 
                        
                        {/* Pełny CRUD produktów (routing zagnieżdżony w ProductManagementPage) */}
                        <Route path="products/*" element={<ProductManagementPage />} /> 
                        
                        {/* Zarządzanie statusami zamówień */}
                        <Route path="orders" element={<OrderManagementPage />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;