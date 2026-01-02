import React, { useEffect } from 'react';
import './OrderSuccess.css';
import { useLanguage } from '../context/LanguageContext';
import DishRating from './DishRating';
import { useCustomer } from '../context/CustomerContext';

export default function OrderSuccess({ orderId, onHome, order }) {
    const { t } = useLanguage();
    const { currentCustomer } = useCustomer();

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="success-container">
            <div className="success-card">
                <div className="checkmark-circle">
                    <div className="background"></div>
                    <div className="checkmark draw"></div>
                </div>

                <h2>{t.success.confirmed}</h2>
                <p className="order-id">{t.success.orderId}: #{orderId}</p>

                <div className="sms-mock">
                    <div className="sms-header">Messages</div>
                    <div className="sms-bubble">
                        <p>{t.success.mockSms}</p>
                        <span className="sms-time">Now</span>
                    </div>
                </div>

                <p className="sms-info">{t.success.sms}</p>

                <button className="home-btn" onClick={onHome}>
                    {t.success.home}
                </button>

                {order && (
                    <div style={{ marginTop: '2rem' }}>
                        <DishRating
                            order={order}
                            customerPhone={currentCustomer?.phone}
                            onComplete={onHome}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
