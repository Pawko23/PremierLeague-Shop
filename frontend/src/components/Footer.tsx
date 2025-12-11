// frontend/src/components/Footer.tsx
import React from 'react';
import './styles/Footer.scss';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer__container">
                <p>&copy; {new Date().getFullYear()} Premier League Shop. Projekt Akademicki.</p>
            </div>
        </footer>
    );
};

export default Footer;