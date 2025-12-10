// client/src/pages/admin/ProductManagementPage.tsx
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ProductList from '../../components/admin/ProductList'; 
import ProductForm from '../../components/admin/ProductForm'; 
import './styles/ProductManagementPage.scss';

const ProductManagementPage: React.FC = () => {
    const location = useLocation();
    
    // Sprawdzamy, czy jesteśmy na ścieżce listy, aby wyświetlić przycisk "Dodaj"
    const isListView = location.pathname === '/admin/products' || location.pathname === '/admin/products/';

    return (
        <div className="product-management">
            <h2>Zarządzanie Produktami</h2>
            
            {isListView && (
                <Link to="new" className="button-create">Dodaj Nowy Produkt</Link>
            )}
            
            <Routes>
                {/* Ścieżka bazowa wyświetla listę produktów */}
                <Route path="/" element={<ProductList />} />
                
                {/* Ścieżka do tworzenia nowego produktu */}
                <Route path="new" element={<ProductForm mode="create" />} />
                
                {/* Ścieżka do edycji istniejącego produktu */}
                <Route path="edit/:id" element={<ProductForm mode="edit" />} />
            </Routes>
        </div>
    );
};

export default ProductManagementPage;