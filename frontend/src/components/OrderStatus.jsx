import React, { useEffect, useState } from 'react';
import './OrderStatus.css';
import io from 'socket.io-client';
import DishRating from './DishRating';
import { useCustomer } from '../context/CustomerContext';

const socket = io('http://localhost:5000');

export default function OrderStatus({ order, onBack }) {
    const [status, setStatus] = useState(order?.status || 'PENDING');
    const [billRequested, setBillRequested] = useState(false);
    const [showRating, setShowRating] = useState(false);
    const { currentCustomer } = useCustomer();
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState('');

    const isOnline = order?.orderType === 'ONLINE';
    const steps = isOnline
        ? ['PENDING', 'COOKING', 'READY', 'DELIVERING']
        : ['PENDING', 'COOKING', 'READY', 'SERVED'];

    useEffect(() => {
        // Join rooms to listen for updates
        if (order?._id) {
            socket.emit('join_order', order._id);
        }
        if (order?.tableId) {
            socket.emit('join_table', order.tableId);
        }

        socket.on('order:status_update', (updatedOrder) => {
            console.log("Received update:", updatedOrder);
            if (updatedOrder._id === order?._id) {
                setStatus(updatedOrder.status);
            }
        });

        socket.on('table:payment_success', () => {
            setShowRating(true);
        });

        return () => {
            socket.off('order:status_update');
            socket.off('table:payment_success');
        };
    }, [order]);

    const handleRequestBill = () => {
        socket.emit('table:request_bill', { tableId: order.tableId });
        setBillRequested(true);
    };

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;
        setPromoError('');
        try {
            const subtotal = order?.totalAmount || 0;
            const res = await fetch('http://localhost:5000/api/promos/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: promoCode, subtotal })
            });
            const data = await res.json();
            if (res.ok) {
                const discountAmt = parseFloat(data.discountAmount);
                setDiscount(discountAmt);
                setAppliedPromo(data);
                setPromoCode('');

                // Emit discount to server for staff sync
                socket.emit('table:apply_discount', {
                    tableId: order.tableId,
                    orderId: order._id,
                    promoCode: data.code,
                    discountAmount: discountAmt,
                    finalTotal: subtotal - discountAmt
                });
            } else {
                setPromoError(data.message || 'Invalid code');
                setDiscount(0);
            }
        } catch (error) {
            setPromoError('Validation failed');
        }
    };

    const getStepClass = (step) => {
        const index = steps.indexOf(step);
        const currentIndex = steps.indexOf(status);
        if (currentIndex > index) return 'step-item completed';
        if (currentIndex === index) return 'step-item active';
        return 'step-item';
    };

    const getIcon = (step) => {
        switch (step) {
            case 'PENDING': return '⏳';
            case 'COOKING': return '🍳';
            case 'READY': return isOnline ? '📦' : '✅';
            case 'SERVED': return '🍽️';
            case 'DELIVERING': return '🛵';
            default: return '•';
        }
    };

    const getLabel = (step) => {
        if (isOnline && step === 'READY') return 'DONE';
        if (isOnline && step === 'DELIVERING') return 'RIDER';
        return step;
    };

    if (showRating) {
        return (
            <div className="status-container">
                <DishRating
                    order={order}
                    customerPhone={currentCustomer?.phone}
                    onComplete={onBack}
                />
            </div>
        );
    }

    return (
        <div className="status-container">
            <header className="status-header">
                <h1>Order #{order?._id?.slice(-4) || '...'}</h1>
                <p>Track your food in real-time</p>
            </header>

            <div className="steps-wrapper">
                {steps.map(step => (
                    <div key={step} className={getStepClass(step)}>
                        <div className="step-circle">{getIcon(step)}</div>
                        <span className="step-label">{getLabel(step)}</span>
                    </div>
                ))}
            </div>

            <div className="status-message">
                {status === 'PENDING' && <p>Your order has been sent to the kitchen.</p>}
                {status === 'COOKING' && <p>Chefs are preparing your delicious meal!</p>}
                {status === 'READY' && (
                    <p>{isOnline ? 'Your food is packed and ready for the rider!' : 'Your food is ready! A waiter will bring it shortly.'}</p>
                )}
                {status === 'DELIVERING' && <p>The rider is on the way to your doorstep! 🛵</p>}
                {status === 'SERVED' && (
                    <div className="served-msg">
                        <p>Enjoy your meal! 😋</p>
                        <small>Delivered by {order.servedBy || 'our team'}</small>
                    </div>
                )}
            </div>

            {status === 'SERVED' && (
                <div className="bill-section">
                    <div className="bill-details" style={{ width: '100%', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Subtotal:</span>
                            <span>৳{order?.totalAmount}</span>
                        </div>
                        {discount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#e11d48' }}>
                                <span>Discount ({appliedPromo?.code}):</span>
                                <span>-৳{discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="bill-total" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', paddingTop: '0.5rem', borderTop: '1px solid #eee' }}>
                            <span>Total:</span>
                            <span>৳{(order?.totalAmount - discount).toFixed(2)}</span>
                        </div>
                    </div>

                    {!billRequested && !appliedPromo && (
                        <div className="promo-input-status" style={{ display: 'flex', gap: '8px', width: '100%', marginBottom: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Enter Promo Code"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                            <button onClick={handleApplyPromo} className="apply-promo-btn" style={{ padding: '8px 12px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Apply
                            </button>
                        </div>
                    )}
                    {promoError && <p style={{ color: '#e11d48', fontSize: '0.8rem', marginBottom: '1rem' }}>{promoError}</p>}

                    {billRequested ? (
                        <button className="btn-request-bill" disabled>
                            Bill Requested 🔔
                        </button>
                    ) : (
                        <button className="btn-request-bill" onClick={handleRequestBill}>
                            Request Bill 💳
                        </button>
                    )}
                </div>
            )}

            {/* Temporary Back Button for Demo */}
            <div style={{ marginTop: '2rem' }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: '#888' }}>
                    &larr; Back to Menu
                </button>
            </div>
        </div>
    );
}
