import React, { useState, useEffect } from 'react';
import './PaymentModal.css';
import { useLanguage } from '../context/LanguageContext';

export default function PaymentModal({ method, isOpen, onConfirm, onClose }) {
    const { t } = useLanguage();
    const [step, setStep] = useState('phone'); // 'phone', 'otp', 'processing'
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStep('phone');
            setPhone('');
            setOtp('');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handlePhoneSubmit = () => {
        if (phone.length < 11) {
            setError('Invalid phone number');
            return;
        }
        setStep('otp');
        setError('');
    };

    const handleOtpSubmit = async () => {
        if (otp.length < 4) {
            setError('Invalid OTP');
            return;
        }
        setStep('processing');
        try {
            await onConfirm();
        } catch (e) {
            setStep('otp');
            setError('Payment failed. Please try again.');
        }
    };

    const getThemeColor = () => {
        if (method === 'bkash') return '#e2136e';
        if (method === 'nagad') return '#f16722';
        return '#333';
    };

    const color = getThemeColor();

    return (
        <div className="payment-overlay">
            <div className="payment-modal">
                <div className="payment-header" style={{ backgroundColor: color }}>
                    <h3>{method === 'bkash' ? t.checkout.bkash : t.checkout.nagad} Payment</h3>
                    <button className="payment-close" onClick={onClose}>&times;</button>
                </div>

                <div className="payment-body">
                    {step === 'processing' ? (
                        <div className="processing-state">
                            <div className="spinner" style={{ borderTopColor: color }}></div>
                            <p>{t.payment.processing}</p>
                        </div>
                    ) : (
                        <>
                            {step === 'phone' ? (
                                <div className="input-group">
                                    <label>{t.payment.enterPhone}</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="017xxxxxxxx"
                                        autoFocus
                                    />
                                </div>
                            ) : (
                                <div className="input-group">
                                    <label>{t.payment.enterOtp}</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="1234"
                                        autoFocus
                                    />
                                    <p className="otp-hint">Use any 4 digits</p>
                                </div>
                            )}

                            {error && <p className="payment-error">{error}</p>}

                            <div className="payment-actions">
                                <button className="cancel-btn" onClick={onClose}>{t.payment.cancel}</button>
                                <button
                                    className="confirm-btn"
                                    style={{ backgroundColor: color }}
                                    onClick={step === 'phone' ? handlePhoneSubmit : handleOtpSubmit}
                                >
                                    {step === 'phone' ? 'Next' : t.payment.confirm}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
