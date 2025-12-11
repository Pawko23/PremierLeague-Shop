// frontend/src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './styles/Header.scss';

const Header: React.FC = () => {
    const { user, isAdmin, logout } = useAuth();
    const { cartCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
            <div className="header__container">
                {/* Logo */}
                <Link to="/" className="header__logo" aria-label="Premier League Shop - Strona główna">
                    <svg className="header__logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="header__logo-text">
                        <span className="header__logo-primary">Premier</span>
                        <span className="header__logo-secondary">League Shop</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="header__nav" aria-label="Main navigation">
                    <Link to="/" className="header__nav-link">
                        <svg className="header__nav-icon" viewBox="0 0 24 24" fill="none">
                            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Sklep
                    </Link>
                    {isAdmin && (
                        <Link to="/admin" className="header__nav-link header__nav-link--admin">
                            <svg className="header__nav-icon" viewBox="0 0 24 24" fill="none">
                                <path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M2 21V19C2 17.9391 2.42143 16.9217 3.17157 16.1716C3.92172 15.4214 4.93913 15 6 15H18C19.0609 15 20.0783 15.4214 20.8284 16.1716C21.5786 16.9217 22 17.9391 22 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Panel
                        </Link>
                    )}
                </nav>

                {/* Actions */}
                <div className="header__actions">
                    {/* Cart Button */}
                    <Link 
                        to="/checkout" 
                        className="header__cart-button"
                        aria-label={`Koszyk - ${cartCount} produktów`}
                    >
                        <svg className="header__cart-icon" viewBox="0 0 24 24" fill="none">
                            <path d="M9 2L7.17 4H3V6H21V4H16.83L15 2H9ZM6 18C6 19.1 6.9 20 8 20C9.1 20 10 19.1 10 18C10 16.9 9.1 16 8 16C6.9 16 6 16.9 6 18ZM14 18C14 19.1 14.9 20 16 20C17.1 20 18 19.1 18 18C18 16.9 17.1 16 16 16C14.9 16 14 16.9 14 18ZM20 6H4V16H20V6Z" fill="currentColor"/>
                        </svg>
                        {cartCount > 0 && (
                            <span className="header__cart-badge" aria-hidden="true">
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        )}
                    </Link>

                    {/* User Menu */}
                    {user ? (
                        <div className="header__user-menu">
                            <button 
                                className="header__user-button"
                                aria-label="Menu użytkownika"
                            >
                                <svg className="header__user-icon" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="header__user-email">{user.email?.split('@')[0]}</span>
                            </button>
                            <div className="header__user-dropdown">
                                <Link to="/orders" className="header__dropdown-link">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Zamówienia
                                </Link>
                                <button onClick={handleLogout} className="header__dropdown-link">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Wyloguj
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="header__login-button">
                            <svg className="header__login-icon" viewBox="0 0 24 24" fill="none">
                                <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Zaloguj</span>
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className={`header__mobile-toggle ${isMobileMenuOpen ? 'header__mobile-toggle--open' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className="header__mobile-toggle-line"></span>
                        <span className="header__mobile-toggle-line"></span>
                        <span className="header__mobile-toggle-line"></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="header__mobile-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Menu */}
            <nav 
                className={`header__mobile-menu ${isMobileMenuOpen ? 'header__mobile-menu--open' : ''}`}
                aria-label="Mobile navigation"
            >
                <Link to="/" className="header__mobile-link">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Sklep
                </Link>
                {isAdmin && (
                    <Link to="/admin" className="header__mobile-link">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M2 21V19C2 17.9391 2.42143 16.9217 3.17157 16.1716C3.92172 15.4214 4.93913 15 6 15H18C19.0609 15 20.0783 15.4214 20.8284 16.1716C21.5786 16.9217 22 17.9391 22 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Panel Administratora
                    </Link>
                )}
                {user && (
                    <Link to="/orders" className="header__mobile-link">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Moje Zamówienia
                    </Link>
                )}
                <div className="header__mobile-divider" />
                {user ? (
                    <>
                        <div className="header__mobile-user">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>{user.email}</span>
                        </div>
                        <button onClick={handleLogout} className="header__mobile-link header__mobile-link--logout">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Wyloguj się
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="header__mobile-link">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Zaloguj się
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;