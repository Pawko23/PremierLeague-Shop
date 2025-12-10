// client/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
// Importy stron (do utworzenia)
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersHistoryPage from './pages/OrdersHistoryPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import LoginForm from './components/LoginForm';
import Layout from './components/Layout.';
import type { JSX } from 'react';

// Wrappery Trasy
const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) return <div>Loading...</div>; // Pokazujemy loader
    return user ? element : <Navigate to="/login" replace />;
};

const AdminRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
    const { isAdmin, isLoading } = useAuth();
    if (isLoading) return <div>Loading...</div>;
    return isAdmin ? element : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {/* Publiczne */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/login" element={<LoginForm />} />
        
        {/* Użytkownik (Wymaga Auth) */}
        <Route path="/checkout" element={<PrivateRoute element={<CheckoutPage />} />} />
        <Route path="/orders" element={<PrivateRoute element={<OrdersHistoryPage />} />} />

        {/* Administrator (Wymaga Auth i roli Admina) */}
        <Route path="/admin/*" element={<AdminRoute element={<AdminDashboard />} />} />
        
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;