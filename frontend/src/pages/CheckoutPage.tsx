// client/src/pages/CheckoutPage.tsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import './styles/CheckoutPage.scss';

const CheckoutPage: React.FC = () => {
    const { cartItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
    const navigate = useNavigate();
    const [shippingAddress, setShippingAddress] = useState({
        name: '',
        street: '',
        city: '',
        zip: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);

    const handleQuantityChange = (item: any, newQuantity: number) => {
        updateQuantity(item.productId, item.size, item.variantType, newQuantity);
    };

    const handleRemove = (item: any) => {
        removeItem(item.productId, item.size, item.variantType);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (cartItems.length === 0) {
            alert('Koszyk jest pusty.');
            return;
        }

        setIsSubmitting(true);
        setOrderError(null);

        // Mapowanie CartItem do struktury oczekiwanej przez Nest.js OrderItem
        const itemsPayload = cartItems.map(item => ({
            productId: item.productId,
            variantType: item.variantType,
            size: item.size,
            quantity: item.quantity,
            price: item.price, 
            // product name zostanie dodany przez backend
        }));

        try {
            // POST /api/orders (chroniony przez FirebaseAuthGuard)
            const response = await api.post('/orders', {
                shippingAddress,
                items: itemsPayload,
            });

            alert(`Zamówienie nr ${response.data.id} złożone pomyślnie!`);
            clearCart();
            navigate('/orders'); // Przekierowanie do historii zamówień

        } catch (error: any) {
            console.error("Błąd podczas składania zamówienia:", error.response?.data);
            setOrderError(error.response?.data?.message || "Wystąpił nieznany błąd podczas składania zamówienia. Spróbuj ponownie.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0) {
        return <div className="checkout-empty">
            <h1>Twój koszyk jest pusty 🛒</h1>
            <p>Dodaj koszulki, aby kontynuować.</p>
            <Link to="/">Wróć do sklepu</Link>
        </div>;
    }

    return (
        <div className="checkout-page">
            <h1>Twój Koszyk i Adres Wysyłki</h1>
            
            <div className="checkout-page__layout">
                {/* 1. Podgląd Koszyka */}
                <div className="cart-summary">
                    <h2>Zawartość koszyka ({cartItems.length} produktów)</h2>
                    {cartItems.map(item => (
                        <div key={`${item.productId}-${item.size}-${item.variantType}`} className="cart-item">
                            <img src={item.imageUrl} alt={item.name} />
                            <div className="item-details">
                                <h4>{item.name} - {item.variantType.toUpperCase()} ({item.size})</h4>
                                <p>{item.price.toFixed(2)} PLN</p>
                            </div>
                            <div className="item-actions">
                                <input 
                                    type="number" 
                                    min="1" 
                                    value={item.quantity} 
                                    onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                                />
                                <button onClick={() => handleRemove(item)}>Usuń</button>
                            </div>
                        </div>
                    ))}
                    <h3 className="cart-total">Suma: {totalPrice.toFixed(2)} PLN</h3>
                </div>

                {/* 2. Formularz Wysyłki i Składanie Zamówienia */}
                <form onSubmit={handleOrderSubmit} className="shipping-form">
                    <h2>Adres Wysyłki</h2>
                    <input name="name" placeholder="Imię i Nazwisko" value={shippingAddress.name} onChange={handleAddressChange} required />
                    <input name="street" placeholder="Ulica i Numer" value={shippingAddress.street} onChange={handleAddressChange} required />
                    <input name="zip" placeholder="Kod Pocztowy" value={shippingAddress.zip} onChange={handleAddressChange} required />
                    <input name="city" placeholder="Miasto" value={shippingAddress.city} onChange={handleAddressChange} required />

                    {orderError && <p className="error-message">{orderError}</p>}
                    
                    <button type="submit" disabled={isSubmitting || cartItems.length === 0}>
                        {isSubmitting ? 'Składanie zamówienia...' : `Złóż zamówienie (${totalPrice.toFixed(2)} PLN)`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;