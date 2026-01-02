import React from 'react';
import './DishCard.css';
import { useLanguage } from '../context/LanguageContext';
import { useCustomer } from '../context/CustomerContext';

export default function DishCard({ dish, onClick, compact }) {
    const { language, t } = useLanguage();
    const { currentCustomer, toggleFavorite } = useCustomer();
    const isAvailable = dish.available;

    const isFavorited = currentCustomer?.favoriteDishes?.some(fav =>
        (typeof fav === 'string' && fav === dish._id) ||
        (typeof fav === 'object' && fav._id === dish._id)
    );

    // Access localized content safely
    const title = dish.title?.[language] || 'Unknown Dish';
    const description = dish.description?.[language] || '';

    const [isAnimating, setIsAnimating] = React.useState(false);

    const handleClick = (e) => {
        if (!isAvailable) return;
        setIsAnimating(true);
        onClick(dish);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const handleToggleFavorite = (e) => {
        e.stopPropagation();
        toggleFavorite(dish._id);
    };

    return (
        <div className={`dish-card ${!isAvailable ? 'out-of-stock' : ''}`} onClick={handleClick}>
            <div className={`dish-image-container ${isAnimating ? 'fly-animation' : ''}`}>
                <img src={dish.image} alt={title} className="dish-image" loading="lazy" />
                <button
                    className={`fav-toggle ${isFavorited ? 'active' : ''}`}
                    onClick={handleToggleFavorite}
                    aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                    {isFavorited ? '❤️' : '🤍'}
                </button>
                {!isAvailable && <span className="badge-oos">{t.dish.soldOutBtn}</span>}
            </div>
            <div className="dish-details">
                <div className="dish-header-row">
                    <h3 className="dish-title">{title}</h3>
                    {isAvailable && <span className="badge-available">{t.dish.available}</span>}
                </div>
                <div className="dietary-badges">
                    {dish.isVegan && <span className="diet-badge v" title="Vegan">V</span>}
                    {dish.isHalal && <span className="diet-badge h" title="Halal">H</span>}
                    {dish.containsNuts && <span className="diet-badge n" title="Contains Nuts">🥜</span>}
                    {dish.containsDairy && <span className="diet-badge d" title="Contains Dairy">🥛</span>}
                    {dish.spiceLevel === 'High' && <span className="spice-badge h">🌶️🌶️🌶️</span>}
                    {dish.spiceLevel === 'Medium' && <span className="spice-badge m">🌶️🌶️</span>}
                </div>
                {!compact && <p className="dish-desc">{description}</p>}
                <div className="dish-footer">
                    <span className="dish-price">${dish.price.toFixed(2)}</span>
                    <button
                        className={`add-btn ${isAnimating ? 'clicked' : ''}`}
                        disabled={!isAvailable}
                        aria-label={`Add ${title} to cart`}
                    >
                        {isAnimating ? '✓' : (isAvailable ? t.dish.addToCart : t.dish.soldOutBtn)}
                    </button>
                </div>
            </div>
        </div>
    );
}
