import React, { useEffect } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { useLanguage } from '../context/LanguageContext';
import './LoyaltyPage.css';

export default function LoyaltyPage({ onBack }) {
    const { currentCustomer, addPoints, requireAuth, isLoading } = useCustomer();
    const { t } = useLanguage();

    useEffect(() => {
        if (!currentCustomer && !isLoading) {
            requireAuth(() => { }); // Force popup
        }
    }, [currentCustomer, isLoading, requireAuth]);

    if (isLoading) {
        return (
            <div className="loyalty-page">
                <button className="back-link" onClick={onBack}>← {t.success.home}</button>
                <div className="loading-state" style={{ textAlign: 'center', marginTop: '100px' }}>
                    <div className="spinner" style={{
                        width: '40px', height: '40px', border: '4px solid #f3f3f3',
                        borderTop: '4px solid #3498db', borderRadius: '50%',
                        animation: 'spin 1s linear infinite', margin: '0 auto 20px'
                    }}></div>
                    <p>Loading Loyalty Data...</p>
                </div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!currentCustomer) {
        return (
            <div className="loyalty-page">
                <button className="back-link" onClick={onBack}>← {t.success.home}</button>
                <div className="loading-state" style={{ textAlign: 'center', marginTop: '50px' }}>
                    <p>Please log in to view Loyalty Program...</p>
                </div>
            </div>
        );
    }

    // Tier Thresholds: Silver < 200, Gold < 600, Platinum >= 600
    const getProgress = () => {
        const pts = currentCustomer.points || 0;
        const tier = currentCustomer.tier || 'Silver';

        if (tier === 'Platinum') return 100;
        if (tier === 'Gold') return Math.min(100, ((pts - 200) / 400) * 100); // 200 to 600
        return Math.min(100, (pts / 200) * 100); // 0 to 200
    };

    const nextTierPoints = currentCustomer.tier === 'Silver' ? 200 : (currentCustomer.tier === 'Gold' ? 600 : null);


    return (
        <div className="loyalty-page">
            <button className="back-link" onClick={onBack}>
                ← {t.success.home}
            </button>

            <div className="loyalty-card">
                <div className={`card-header tier-${currentCustomer.tier.toLowerCase()}`}>
                    <div className="profile-pic">
                        <span>{currentCustomer.name.charAt(0)}</span>
                    </div>
                    <div className="user-info">
                        <h2>{currentCustomer.name}</h2>
                        <span className="tier-badge">{t.loyalty.tiers[currentCustomer.tier]}</span>
                    </div>
                    <div className="points-display">
                        <span className="amount">{currentCustomer.points}</span>
                        <span className="label">PTS</span>
                    </div>
                </div>

                <div className="card-body">
                    <div className="progress-section">
                        <div className="progress-labels">
                            <span>{currentCustomer.tier}</span>
                            {nextTierPoints && <span>Next: {nextTierPoints}</span>}
                        </div>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${getProgress()}%` }}></div>
                        </div>
                        <p className="benefit-text">
                            ✨ {t.loyalty.benefitList[currentCustomer.tier]}
                        </p>
                    </div>

                    <div className="history-section">
                        <h3>{t.loyalty.history}</h3>
                        {currentCustomer.history.length === 0 ? (
                            <p className="no-history">{t.loyalty.noHistory}</p>
                        ) : (
                            <ul className="history-list">
                                {currentCustomer.history.slice(0, 5).map(item => (
                                    <li key={item.id} className="history-item">
                                        <div className="history-info">
                                            <span className="history-action">{item.action}</span>
                                            <span className="history-date">{item.date}</span>
                                        </div>
                                        <span className="history-points">+{item.points}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="dev-tools">
                        <button className="simulate-points-btn" onClick={() => addPoints(50, 'Bonus Points')}>
                            {t.loyalty.simulateBtn}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
