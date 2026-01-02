import React from 'react';
import './CartIcon.css';
import { useLanguage } from '../context/LanguageContext';

export default function CartIcon({ count, subtotal, onClick }) {
    const { t } = useLanguage();

    if (count === 0) return null;

    return (
        <div className="cart-float" onClick={onClick}>
            <div className="cart-info">
                <span className="cart-count">{count} {t.cart.items}</span>
                <span className="cart-total">${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-icon-wrapper">
                <span className="basket-icon">🛒</span>
            </div>
        </div>
    );
}
