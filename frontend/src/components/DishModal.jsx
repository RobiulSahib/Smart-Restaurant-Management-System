import React, { useState, useEffect } from 'react';
import './DishModal.css';
import { useLanguage } from '../context/LanguageContext';

// Hardcoded Price Modifiers (Since backend data is simple)
const PRICE_MODIFIERS = {
    // Upgrades
    'Large': 4.00,
    'Pitcher': 8.00,
    'Double Patty': 5.00,
    'Extra Shot': 2.00,

    // Base Options (No Extra Cost)
    'Regular': 0,
    'Small': 0, // Changed from -2.00 per user request to imply Regular is baseline or just 0
    'Single': 0,
    'Slice': 0,
    'Glass': 0,
    'Medium Rare': 0,
    'Well Done': 0,
    'Medium': 0,
    'Mild': 0, // Spices
    'Hot': 0,

    // Defaults for addons
    'default_addon': 1.50
};

export default function DishModal({ dish, isOpen, onClose, onAddToCart }) {
    const [size, setSize] = useState('');
    const [spice, setSpice] = useState('Medium');
    const [addons, setAddons] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const { language, t } = useLanguage();

    // Reset state when dish changes
    useEffect(() => {
        if (dish && dish.options) {
            setSize(dish.options.sizes[0]);
            setSpice('Medium');
            setAddons([]);
            setQuantity(1);
        }
    }, [dish]);

    if (!isOpen || !dish) return null;

    const title = dish.title[language];
    const description = dish.description[language];

    // ---- PRICING LOGIC ----
    const getModifierPrice = (name) => {
        if (!name) return 0;
        if (PRICE_MODIFIERS[name] !== undefined) return PRICE_MODIFIERS[name];
        // If it's an addon, assume default price
        return PRICE_MODIFIERS.default_addon;
    };

    const calculateUnitPrice = () => {
        let price = dish.price;

        // Add Size Cost
        price += getModifierPrice(size);

        // Add Addons Cost
        addons.forEach(addon => {
            price += getModifierPrice(addon);
        });

        return price;
    };

    const unitPrice = calculateUnitPrice();
    const finalTotal = (unitPrice * quantity).toFixed(2);

    const handleAddonToggle = (addon) => {
        setAddons(prev =>
            prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
        );
    };

    const handleAddToCart = () => {
        onAddToCart({
            ...dish,
            title: title,
            selectedSize: size,
            selectedSpice: spice,
            selectedAddons: addons,
            quantity,
            // OVERWRITE price with calculated one so Cart uses this
            totalPrice: finalTotal, // Store string or number? component expects string generally for display, logic uses float
            price: unitPrice // Save the unit price for this configuration
        });
        onClose();
    };

    const formatExtraCost = (name) => {
        const cost = getModifierPrice(name);
        if (cost > 0) return ` (+$${cost.toFixed(2)})`;
        if (cost < 0) return ` (-$${Math.abs(cost).toFixed(2)})`;
        return '';
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>

                <div className="modal-header">
                    <img src={dish.image} alt={title} className="modal-image" />
                    <div className="modal-title-section">
                        <h2>{title}</h2>
                        <div className="modal-price-row">
                            <span className="base-price">${dish.price.toFixed(2)}</span>
                            {unitPrice !== dish.price && (
                                <span className="current-unit-price"> → ${unitPrice.toFixed(2)} / each</span>
                            )}
                        </div>
                        <div className="modal-dietary-badges">
                            {dish.isVegan && <span className="diet-badge v">Vegan 🌿</span>}
                            {dish.isHalal && <span className="diet-badge h">Halal ☪️</span>}
                            {dish.isVegetarian && <span className="diet-badge v">Vegetarian 🥗</span>}
                        </div>
                    </div>
                </div>

                <div className="modal-body">
                    {dish.containsNuts && (
                        <div className="allergy-warning nut-warning">
                            ⚠️ <strong>Allergy Warning:</strong> This dish contains nuts.
                        </div>
                    )}
                    {dish.containsDairy && (
                        <div className="allergy-warning dairy-warning">
                            ⚠️ <strong>Dietary Note:</strong> This dish contains dairy products.
                        </div>
                    )}
                    <p className="modal-desc">{description}</p>

                    <div className="options-section">
                        {dish.options.sizes && dish.options.sizes.length > 0 && (
                            <div className="option-group">
                                <h3>{t.dish.size}</h3>
                                <div className="chip-group">
                                    {dish.options.sizes.map(s => (
                                        <button
                                            key={s}
                                            className={`chip ${size === s ? 'active' : ''}`}
                                            onClick={() => setSize(s)}
                                        >
                                            {t.sizes[s] || s}
                                            <span className="chip-price">{formatExtraCost(s)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {dish.options.spice && (
                            <div className="option-group">
                                <h3>{t.dish.spice}</h3>
                                <div className="chip-group">
                                    {['Mild', 'Medium', 'Hot'].map(s => (
                                        <button
                                            key={s}
                                            className={`chip ${spice === s ? 'active' : ''}`}
                                            onClick={() => setSpice(s)}
                                        >
                                            {t.spice[s]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {dish.options.addons && dish.options.addons.length > 0 && (
                            <div className="option-group">
                                <h3>{t.dish.addons}</h3>
                                <div className="addon-list">
                                    {dish.options.addons.map(addon => (
                                        <label key={addon} className="addon-item">
                                            <input
                                                type="checkbox"
                                                checked={addons.includes(addon)}
                                                onChange={() => handleAddonToggle(addon)}
                                            />
                                            <span>
                                                {t.addons[addon] || addon}
                                                <small style={{ color: '#fa5252', fontWeight: 'bold' }}>{formatExtraCost(addon)}</small>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <div className="qty-control">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                        <button className="modal-add-btn" onClick={handleAddToCart}>
                            {t.dish.addToOrder} - ${finalTotal}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
