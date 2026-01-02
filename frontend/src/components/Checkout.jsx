import React, { useState } from 'react';
import './Checkout.css';
import { useLanguage } from '../context/LanguageContext';
import UpsellSuggestions from './UpsellSuggestions';

export default function Checkout({ cart, onUpdateCart, onPlaceOrder, onBack, isDineIn }) {
    const { t, language } = useLanguage();
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [promoError, setPromoError] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);

    const subtotal = cart.reduce((acc, item) => acc + parseFloat(item.totalPrice || item.price), 0);
    const total = subtotal - discount;

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;
        setPromoError('');
        try {
            const res = await fetch('http://localhost:5000/api/promos/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: promoCode, subtotal })
            });
            const data = await res.json();
            if (res.ok) {
                setDiscount(parseFloat(data.discountAmount));
                setAppliedPromo(data);
                setPromoCode('');
            } else {
                setPromoError(data.message || 'Invalid code');
                setDiscount(0);
                setAppliedPromo(null);
            }
        } catch (error) {
            setPromoError('Validation failed');
        }
    };

    const updateQuantity = (index, delta) => {
        const newCart = [...cart];
        const item = newCart[index];
        const newQty = (item.quantity || 1) + delta;

        if (newQty <= 0) {
            newCart.splice(index, 1);
        } else {
            item.quantity = newQty;
            const unitPrice = parseFloat(item.totalPrice) / (item.quantity - delta);
            item.totalPrice = (unitPrice * newQty).toFixed(2);
        }
        onUpdateCart(newCart);
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-empty">
                <h2>{t.checkout.empty}</h2>
                <button className="back-btn" onClick={onBack}>{t.checkout.backToMenu}</button>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="checkout-header">
                <button className="back-link" onClick={onBack}>← {t.checkout.backToMenu}</button>
                <h2>{t.checkout.title}</h2>
            </div>

            <div className="checkout-content">
                <div className="checkout-items">
                    <h3>{t.checkout.summary}</h3>
                    {cart.map((item, index) => (
                        <div key={index} className="checkout-item">
                            <img src={item.image} alt={item.title[language] || item.title} className="item-thumb" />
                            <div className="item-info">
                                <h4>{item.title[language] || item.title}</h4>
                                <p className="item-options">
                                    {item.selectedSize && <span>{item.selectedSize}, </span>}
                                    {item.selectedSpice && <span>{item.selectedSpice}</span>}
                                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                                        <span className="item-addons"> + {item.selectedAddons.join(', ')}</span>
                                    )}
                                </p>
                                <div className="item-price">${item.totalPrice}</div>
                            </div>
                            <div className="item-qty">
                                <button onClick={() => updateQuantity(index, -1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(index, 1)}>+</button>
                            </div>
                        </div>
                    ))}

                    <UpsellSuggestions
                        cart={cart}
                        onAddToCart={(item) => onUpdateCart([...cart, item])}
                    />
                </div>

                <div className="checkout-sidebar">
                    <div className="bill-card">
                        <div className="bill-row">
                            <span>{t.checkout.subtotal}</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>

                        {!isDineIn && (
                            <div className="promo-section">
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        placeholder={t.checkout.promoPlaceholder}
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                    />
                                    <button onClick={handleApplyPromo} disabled={appliedPromo !== null}>
                                        {appliedPromo ? 'Applied' : t.checkout.apply}
                                    </button>
                                </div>
                                {promoError && <p style={{ color: '#e11d48', fontSize: '0.8rem', marginTop: '5px' }}>{promoError}</p>}
                                {appliedPromo && (
                                    <div style={{ marginTop: '8px', padding: '8px', background: '#f0fdf4', borderRadius: '6px', fontSize: '0.85rem', color: '#166534', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Code <strong>{appliedPromo.code}</strong> applied!</span>
                                        <button
                                            onClick={() => { setAppliedPromo(null); setDiscount(0); }}
                                            style={{ background: 'none', border: 'none', color: '#166534', cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {discount > 0 && (
                            <div className="bill-row discount">
                                <span>{t.checkout.discount}</span>
                                <span>-${discount.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="bill-divider"></div>

                        <div className="bill-row total">
                            <span>{t.checkout.total}</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    {!isDineIn ? (
                        <div className="payment-card">
                            <h3>{t.checkout.paymentMethod}</h3>
                            <div className="payment-options">
                                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                    />
                                    <span className="payment-label">{t.checkout.cod}</span>
                                </label>
                                <label className={`payment-option ${paymentMethod === 'bkash' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="bkash"
                                        checked={paymentMethod === 'bkash'}
                                        onChange={() => setPaymentMethod('bkash')}
                                    />
                                    <span className="payment-label bkash-label">{t.checkout.bkash}</span>
                                </label>
                                <label className={`payment-option ${paymentMethod === 'nagad' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="nagad"
                                        checked={paymentMethod === 'nagad'}
                                        onChange={() => setPaymentMethod('nagad')}
                                    />
                                    <span className="payment-label nagad-label">{t.checkout.nagad}</span>
                                </label>
                            </div>

                            <button
                                className={`place-order-btn ${isSubmitting ? 'loading' : ''}`}
                                onClick={async () => {
                                    if (isSubmitting) return;
                                    setIsSubmitting(true);
                                    try {
                                        await onPlaceOrder(total, paymentMethod);
                                    } catch (e) {
                                        setIsSubmitting(false);
                                    }
                                }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? t.checkout.processing || 'Processing...' : `${t.checkout.placeOrder} - $${total.toFixed(2)}`}
                            </button>
                        </div>
                    ) : (
                        <div className="dine-in-confirm-card">
                            <p style={{ marginBottom: '1rem', color: '#666', fontSize: '0.9rem' }}>
                                📍 Ordering as Dine-In. You can request your bill after your meal.
                            </p>
                            <button
                                className={`place-order-btn ${isSubmitting ? 'loading' : ''}`}
                                onClick={async () => {
                                    if (isSubmitting) return;
                                    setIsSubmitting(true);
                                    try {
                                        await onPlaceOrder(total, 'DINE_IN');
                                    } catch (e) {
                                        setIsSubmitting(false);
                                    }
                                }}
                                disabled={isSubmitting}
                                style={{ background: '#1a1a1a' }}
                            >
                                {isSubmitting ? 'Processing...' : 'Confirm Dine-In Order'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
