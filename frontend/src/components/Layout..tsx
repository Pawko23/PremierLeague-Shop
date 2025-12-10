// client/src/components/Layout.tsx
import React, { type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer'; // Do utworzenia

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="app-container">
            <Header />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;