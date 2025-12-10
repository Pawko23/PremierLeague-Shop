// client/src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './styles/Header.scss';

const Header: React.FC = () => {
    const { user, isAdmin, logout } = useAuth();
    const { cartCount } = useCart();

    return (
        <header className="header">
            <div className="header__logo">
                <Link to="/">Premier League Shop</Link>
            </div>
            <nav className="header__nav">
                <Link to="/">Sklep</Link>
                {isAdmin && <Link to="/admin">Admin Panel</Link>}
            </nav>
            <div className="header__actions">
                <Link to="/checkout" className="header__cart">
                    Koszyk ({cartCount})
                </Link>
                {user ? (
                    <>
                        <span>Witaj, {user.email}</span>
                        <button onClick={logout}>Wyloguj</button>
                    </>
                ) : (
                    <Link to="/login">Zaloguj/Zarejestruj</Link>
                )}
            </div>
        </header>
    );
};

export default Header;