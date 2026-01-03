import React, { useState, useEffect } from 'react';
import './UpsellSuggestions.css';
import { useLanguage } from '../context/LanguageContext';
import { API_URL } from '../config';

export default function UpsellSuggestions({ cart, onAddToCart }) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const { language, t } = useLanguage();

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!cart || cart.length === 0) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                // Construct cart payload for the backend
                const cartItems = cart.map(item => ({
                    dishId: item._id,
                    quantity: item.quantity
                }));
                const totalAmount = cart.reduce((acc, item) => acc + parseFloat(item.totalPrice || item.price), 0);

                const response = await fetch(`${API_URL}/api/upsell/suggestions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cartItems, totalAmount })
                });

                if (response.ok) {
                    const data = await response.json();
                    setSuggestions(data.suggestions);
                }
            } catch (error) {
                console.error('Failed to fetch upsell suggestions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [cart]);

    if (loading && suggestions.length === 0) return null;
    if (!loading && suggestions.length === 0) return null;

    const handleQuickAdd = (dish) => {
        onAddToCart({
            ...dish,
            title: dish.title[language],
            selectedSize: dish.options.sizes?.[0] || 'Regular',
            selectedSpice: 'Medium',
            selectedAddons: [],
            quantity: 1,
            price: dish.price,
            totalPrice: dish.price.toFixed(2)
        });
    };

    return (
        <div className="upsell-container">
            <h3 className="upsell-title">
                {language === 'en' ? 'Complete your meal' : 'আপনার খাবার সম্পন্ন করুন'} ✨
            </h3>
            <div className="upsell-grid">
                {suggestions.map(dish => (
                    <div key={dish._id} className="upsell-card">
                        <img src={dish.image} alt={dish.title[language]} className="upsell-image" />
                        <div className="upsell-info">
                            <h4 className="upsell-item-name">{dish.title[language]}</h4>
                            <p className="upsell-item-price">${dish.price.toFixed(2)}</p>
                            <button
                                className="upsell-add-btn"
                                onClick={() => handleQuickAdd(dish)}
                            >
                                + {t.dish.addToOrder || 'Add'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
