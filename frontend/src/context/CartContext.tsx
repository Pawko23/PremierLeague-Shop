// client/src/context/CartContext.tsx
import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react';

// Typy
export interface CartItem {
    productId: string;
    name: string;
    price: number;
    size: 'S' | 'M' | 'L' | 'XL';
    variantType: 'home' | 'away';
    imageUrl: string; // URL obrazu
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
    updateQuantity: (productId: string, size: string, variantType: string, quantity: number) => void;
    removeItem: (productId: string, size: string, variantType: string) => void;
    clearCart: () => void;
    totalPrice: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Funkcja pomocnicza do generowania unikalnego klucza dla wariantu produktu
const generateItemKey = (productId: string, size: string, variantType: string): string => 
    `${productId}-${size}-${variantType}`;

const getInitialCart = (): CartItem[] => {
    const savedCart = localStorage.getItem('premier_league_cart');
    return savedCart ? JSON.parse(savedCart) : [];
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart); 

    // Synchronizacja stanu koszyka z localStorage
    useEffect(() => {
        localStorage.setItem('premier_league_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Dodawanie produktu do koszyka
    const addItem = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
        if (quantity <= 0) return;

        const key = generateItemKey(item.productId, item.size, item.variantType);
        
        setCartItems(prev => {
            const existingItem = prev.find(i => 
                generateItemKey(i.productId, i.size, i.variantType) === key
            );
            
            if (existingItem) {
                // Zwiększenie ilości, jeśli produkt już istnieje
                return prev.map(i => i === existingItem ? 
                    { ...i, quantity: i.quantity + quantity } : i);
            } else {
                // Dodanie nowego produktu
                return [...prev, { ...item, quantity }];
            }
        });
    };

    // Zmiana ilości istniejącego produktu
    const updateQuantity = (productId: string, size: string, variantType: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeItem(productId, size, variantType);
            return;
        }

        const keyToUpdate = generateItemKey(productId, size, variantType);

        setCartItems(prev => {
            return prev.map(item => {
                const itemKey = generateItemKey(item.productId, item.size, item.variantType);
                if (itemKey === keyToUpdate) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
        });
    };

    // Usuwanie produktu
    const removeItem = (productId: string, size: string, variantType: string) => {
        const keyToRemove = generateItemKey(productId, size, variantType);
        setCartItems(prev => prev.filter(i => 
            generateItemKey(i.productId, i.size, i.variantType) !== keyToRemove
        ));
    };

    const clearCart = () => setCartItems([]);

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addItem, updateQuantity, removeItem, clearCart, totalPrice, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};