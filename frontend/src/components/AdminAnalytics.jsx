import React, { useState, useEffect } from 'react';
import './AdminAnalytics.css';

export default function AdminAnalytics({ onBack }) {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/reviews/analytics')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="analytics-loading">Loading performance data...</div>;

    const lowestRated = [...stats].sort((a, b) => a.averageRating - b.averageRating).slice(0, 3);

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <button className="back-btn-simple" onClick={onBack}>← Back</button>
                <h2>Dish Performance & Feedback</h2>
            </div>

            {lowestRated.length > 0 && lowestRated[0].averageRating < 3 && (
                <div className="alert-section">
                    <h3>⚠️ Low Rated Dishes (Action Required)</h3>
                    <div className="alert-cards">
                        {lowestRated.filter(s => s.averageRating < 3).map(dish => (
                            <div key={dish._id} className="alert-card">
                                <strong>{dish.dishName}</strong>
                                <span className="alert-rating">{dish.averageRating.toFixed(1)} ★</span>
                                <p>{dish.totalReviews} reviews</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="stats-grid">
                <div className="stats-main">
                    <h3>All Dishes</h3>
                    <table className="stats-table">
                        <thead>
                            <tr>
                                <th>Dish Name</th>
                                <th>Avg. Rating</th>
                                <th>Total Reviews</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.map(dish => (
                                <tr key={dish._id}>
                                    <td>{dish.dishName}</td>
                                    <td className="rating-cell">
                                        <span className={`rating-badge ${dish.averageRating >= 4 ? 'high' : dish.averageRating < 3 ? 'low' : 'mid'}`}>
                                            {dish.averageRating.toFixed(1)} ★
                                        </span>
                                    </td>
                                    <td>{dish.totalReviews}</td>
                                    <td>
                                        {dish.averageRating >= 4.5 ? '🔥 Popular' :
                                            dish.averageRating < 3 ? '📉 Poor' : '✅ Stable'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="recent-feedback">
                    <h3>Recent Comments</h3>
                    <div className="comments-list">
                        {stats.flatMap(s => s.comments.map(c => ({ ...c, dishName: s.dishName })))
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .slice(0, 10)
                            .map((comment, idx) => (
                                <div key={idx} className="comment-card">
                                    <div className="comment-header">
                                        <strong>{comment.dishName}</strong>
                                        <span>{comment.rating} ★</span>
                                    </div>
                                    <p>"{comment.text || 'No text provided'}"</p>
                                    <small>{new Date(comment.date).toLocaleDateString()}</small>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
