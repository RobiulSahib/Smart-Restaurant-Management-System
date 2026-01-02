import React, { useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { useLanguage } from '../context/LanguageContext';
import './CustomerAuthModal.css';

export default function CustomerAuthModal() {
    const { isAuthModalOpen, setIsAuthModalOpen, login } = useCustomer();
    const { t } = useLanguage();

    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    if (!isAuthModalOpen) return null;

    const handlePhoneChange = (e) => {
        const val = e.target.value;
        // Only allow digits
        if (/^\d*$/.test(val)) {
            setPhone(val);
            setError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (phone.length !== 11) {
            setError('Phone number must be exactly 11 digits');
            return;
        }

        login(phone, name);
        setPhone('');
        setName('');
        setError('');
    };

    return (
        <div className="auth-overlay">
            <div className="auth-modal">
                <button className="close-btn" onClick={() => setIsAuthModalOpen(false)}>×</button>

                <h3>{t.loyalty.loginTitle}</h3>
                <p className="auth-subtitle">Enter your details to access features</p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Mobile Number</label>
                        <div className="phone-input-container" style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                            <span style={{
                                background: '#eee',
                                padding: '12px 10px',
                                color: '#555',
                                fontWeight: 'bold',
                                borderRight: '1px solid #ddd'
                            }}>
                                +88
                            </span>
                            <input
                                type="tel"
                                placeholder="017XXXXXXXX"
                                value={phone}
                                onChange={handlePhoneChange}
                                required
                                autoFocus
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    padding: '12px',
                                    flex: 1
                                }}
                                maxLength={11}
                            />
                        </div>
                        {error && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{error}</p>}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Your Name</label>
                        <input
                            type="text"
                            placeholder={t.loyalty.namePlaceholder}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <button type="submit" className="login-btn">
                        {t.loyalty.continueBtn}
                    </button>

                    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '1rem', textAlign: 'center' }}>
                        Creating unique profile for +88{phone || '...'}
                    </p>
                </form>
            </div>
        </div>
    );
}
