import React, { useState } from 'react';
import './DishRating.css';
import { useCustomer } from '../context/CustomerContext';

export default function DishRating({ order, onComplete, customerPhone }) {
    const { currentCustomer, toggleFavorite } = useCustomer();
    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [step, setStep] = useState('feedback'); // 'feedback', 'favorite', 'final'

    const handleRate = (dishId, stars) => {
        setRatings(prev => ({ ...prev, [dishId]: stars }));
    };

    const handleComment = (dishId, text) => {
        setComments(prev => ({ ...prev, [dishId]: text }));
    };

    const handleToggleFavorite = (dishId) => {
        toggleFavorite(dishId);
    };

    const handleSubmit = async () => {
        if (Object.keys(ratings).length === 0) {
            alert("Please rate at least one dish!");
            return;
        }

        setSubmitting(true);
        try {
            const reviewData = Object.keys(ratings).map(dishId => {
                const dish = order.items.find(item => (item.id || item._id).toString() === dishId);
                return {
                    dishId: dishId,
                    dishName: dish?.name || dish?.title || 'Unknown Dish',
                    rating: ratings[dishId],
                    comment: comments[dishId] || ''
                };
            });

            const response = await fetch('http://localhost:5000/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: order._id,
                    reviews: reviewData,
                    customerPhone: customerPhone
                })
            });

            setSubmitted(true);
            setStep('favorite'); // Move to next step after feedback
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSkipFeedback = () => {
        setStep('favorite');
    };

    const handleFinishReview = () => {
        setStep('final');
        setTimeout(() => onComplete(), 2000);
    };

    if (step === 'final') {
        return (
            <div className="rating-thank-you">
                <div className="success-lottie">🎉</div>
                <h3>⭐ Thank you for your feedback!</h3>
                <p>We appreciate your help in making our food even better.</p>
            </div>
        );
    }

    if (step === 'favorite') {
        return (
            <div className="dish-rating-card favorite-pick-step">
                <h3 className="rating-title pink-accent">💖 Which food you loved the most today?</h3>
                <p className="pick-subtitle">Tap the heart for your favorites!</p>

                <div className="rating-items">
                    {order.items.map((item) => {
                        const dishId = (item.id || item._id).toString();
                        const isFavorited = currentCustomer?.favoriteDishes?.some(fav => {
                            const favId = typeof fav === 'string' ? fav : fav._id?.toString();
                            return favId === dishId;
                        });

                        return (
                            <div key={dishId} className={`pick-item ${isFavorited ? 'picked' : ''}`} onClick={() => handleToggleFavorite(dishId)}>
                                <div className="pick-content">
                                    <span className="dish-name-label">{item.name || item.title}</span>
                                    <span className="heart-icon">{isFavorited ? '❤️' : '🤍'}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="button-group-vertical">
                    <button className="finish-btn" onClick={handleFinishReview}>
                        Done / Finish Review
                    </button>
                    <button className="skip-btn-text" onClick={handleFinishReview}>
                        Ignore / Skip
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dish-rating-card">
            <h3 className="rating-title">How was your food?</h3>
            <div className="rating-items">
                {order.items.map((item) => {
                    const dishId = (item.id || item._id).toString();
                    const isFavorited = currentCustomer?.favoriteDishes?.some(fav => {
                        const favId = typeof fav === 'string' ? fav : fav._id?.toString();
                        return favId === dishId;
                    });

                    return (
                        <div key={dishId} className="rating-item">
                            <div className="dish-info-compact" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <span className="dish-name-label">{item.name || item.title}</span>
                                <button
                                    className={`fav-star-btn ${isFavorited ? 'active' : ''}`}
                                    onClick={() => handleToggleFavorite(dishId)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                    title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                                >
                                    {isFavorited ? '❤️' : '🤍'}
                                </button>
                            </div>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span
                                        key={star}
                                        className={`star ${ratings[dishId] >= star ? 'filled' : ''}`}
                                        onClick={() => handleRate(dishId, star)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <textarea
                                className="rating-comment-box"
                                placeholder="Optional feedback..."
                                value={comments[dishId] || ''}
                                onChange={(e) => handleComment(dishId, e.target.value)}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="button-group-vertical">
                <button
                    className={`submit-rating-btn ${submitting ? 'loading' : ''}`}
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? 'Submitting...' : 'Submit Ratings'}
                </button>
                <button className="skip-link-btn" onClick={handleSkipFeedback}>
                    I want to skip feedback
                </button>
            </div>
        </div>
    );
}
