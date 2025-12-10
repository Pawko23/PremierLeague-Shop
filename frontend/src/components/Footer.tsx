// client/src/components/Footer.tsx
import React from 'react';
import './styles/Footer.scss';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Premier League Shop. Projekt Akademicki.</p>
        </footer>
    );
};

export default Footer;