import React, { useState, useEffect } from 'react';
import { useStaff } from '../context/StaffContext';
import './BillingPage.css';

export default function BillingPage({ tableId, onBack, onComplete }) {
    const { tables, waiters, currentUser, updateTableStatus, resolveRequest, confirmPayment } = useStaff();
    const table = tables.find(t => t.id === tableId);

    // State
    const [discount, setDiscount] = useState(0); // Percent (staff override)
    const [tip, setTip] = useState(0);
    const [splitCount, setSplitCount] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState(null); // 'cash', 'bkash', 'nagad'
    const [showReceipt, setShowReceipt] = useState(false);

    if (!table) return <div>Table not found</div>;

    // Calculations
    const subtotal = table.orders.reduce((acc, order) => {
        const price = order.price || 0;
        return acc + (price * (order.qty || 1));
    }, 0);

    // Use customer-applied promo discount if present, otherwise use staff discount
    const customerDiscount = table.discount || 0;
    const staffDiscountAmount = (subtotal * discount) / 100;
    const effectiveDiscount = customerDiscount > 0 ? customerDiscount : staffDiscountAmount;
    const appliedPromoCode = table.appliedPromo || null;

    const totalAfterDiscount = subtotal - effectiveDiscount;
    const finalTotal = totalAfterDiscount + parseFloat(tip || 0);
    const perPerson = finalTotal / splitCount;

    const handlePayment = (method) => {
        setPaymentMethod(method);
        // Simulate processing
        setTimeout(() => {
            setShowReceipt(true);
        }, 500);
    };

    const handleFinalize = () => {
        // 1. Confirm Payment & Close Table via Socket
        // Ensure method is set, default to cash if null
        confirmPayment(tableId, paymentMethod || 'cash');

        // 2. Log Tip/Performance (Simulated)
        console.log(`[Performance] Waiter: ${currentUser.name}, Tip: ${tip}, Bill: ${finalTotal}`);

        // 3. Close
        onComplete();
    };

    if (showReceipt) {
        return (
            <div className="billing-container receipt-view">
                <div className="receipt-paper">
                    <div className="receipt-header">
                        <h2>RestoApp</h2>
                        <p>123 Food Street, Dhaka</p>
                        <p>Tel: +880 1234 567890</p>
                    </div>
                    <div className="receipt-meta">
                        <span>Date: {new Date().toLocaleDateString()}</span>
                        <span>Time: {new Date().toLocaleTimeString()}</span>
                        <span>Table: {tableId}</span>
                        <span>Staff: {currentUser?.name}</span>
                    </div>
                    <div className="receipt-divider">--------------------------------</div>
                    <div className="receipt-items">
                        {table.orders.map((order, idx) => (
                            <div key={idx} className="receipt-item">
                                <span>{order.quantity || 1}x {order.name}</span>
                                <span>${(order.price || 0) * (order.quantity || order.qty || 1)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="receipt-divider">--------------------------------</div>
                    <div className="receipt-summary">
                        <div className="row"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                        {appliedPromoCode && (
                            <div className="row" style={{ color: '#e11d48' }}><span>Promo ({appliedPromoCode}):</span><span>-${effectiveDiscount.toFixed(2)}</span></div>
                        )}
                        {!appliedPromoCode && discount > 0 && (
                            <div className="row"><span>Discount ({discount}%):</span><span>-${effectiveDiscount.toFixed(2)}</span></div>
                        )}
                        <div className="row font-bold"><span>Total:</span><span>${finalTotal.toFixed(2)}</span></div>
                        {parseFloat(tip) > 0 && <div className="row"><span>Tip included:</span><span>${tip}</span></div>}
                        <div className="row"><span>Method:</span><span>{paymentMethod?.toUpperCase()}</span></div>
                    </div>
                    <div className="receipt-footer">
                        <p>Thank you for dining with us!</p>
                        <p>VAT Reg: 123456789</p>
                    </div>

                    {/* S.M.S Preview */}
                    <div className="sms-shim">
                        <strong>SMS Preview:</strong> "Paid ${finalTotal.toFixed(2)} at RestoApp. TrxID: 8X92N. Thanks!"
                    </div>

                    <button className="print-btn" onClick={handleFinalize}>🖨️ Print & Close Table</button>
                    <button className="close-btn-text" onClick={() => setShowReceipt(false)}>Edit</button>
                </div>
            </div>
        );
    }

    return (
        <div className="billing-container">
            <div className="billing-header">
                <button onClick={onBack}>← Back</button>
                <h2>Billing: Table {tableId}</h2>
            </div>

            <div className="billing-grid">
                {/* Left: Order Summary */}
                <div className="bill-section order-summary">
                    <h3>Order Details</h3>
                    <div className="order-list-scroll">
                        {table.orders.length === 0 ? <p>No items.</p> : table.orders.map((order, idx) => (
                            <div key={idx} className="bill-item-row">
                                <div className="item-info">
                                    <span className="qty">{order.qty || 1}x</span>
                                    <span className="name">{order.name}</span>
                                </div>
                                <span className="price">${((order.price || 0) * (order.qty || 1)).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="subtotal-row">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Right: Controls */}
                <div className="bill-section controls">
                    {/* Discount */}
                    <div className="control-group">
                        <label>Discount (%)</label>
                        <div className="input-group">
                            <button onClick={() => setDiscount(0)} className={discount === 0 ? 'active' : ''}>0%</button>
                            <button onClick={() => setDiscount(5)} className={discount === 5 ? 'active' : ''}>5%</button>
                            <button onClick={() => setDiscount(10)} className={discount === 10 ? 'active' : ''}>10%</button>
                            <input
                                type="number"
                                value={discount}
                                onChange={e => setDiscount(Number(e.target.value))}
                                placeholder="Custom"
                            />
                        </div>
                    </div>

                    {/* Tip */}
                    <div className="control-group">
                        <label>Tip / Gratuity ($)</label>
                        <input
                            type="number"
                            className="full-input"
                            value={tip}
                            onChange={e => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val) && val >= 0) setTip(val);
                                else if (e.target.value === '') setTip('');
                            }}
                        />
                    </div>

                    {/* Split Bill */}
                    <div className="control-group">
                        <label>Split Bill</label>
                        <div className="split-controls">
                            <button onClick={() => setSplitCount(Math.max(1, splitCount - 1))}>-</button>
                            <span>{splitCount} Person(s)</span>
                            <button onClick={() => setSplitCount(splitCount + 1)}>+</button>
                        </div>
                        {splitCount > 1 && (
                            <div className="split-result">
                                Is ${perPerson.toFixed(2)} / each
                            </div>
                        )}
                    </div>

                    {/* Payment Types */}
                    <div className="payment-section">
                        <h3>Payment Method</h3>
                        <div className="payment-buttons">
                            <button className="pay-btn cash" onClick={() => handlePayment('cash')}>
                                💵 Cash
                            </button>
                            <button className="pay-btn bkash" onClick={() => handlePayment('bkash')}>
                                🚀 Bkash
                            </button>
                            <button className="pay-btn nagad" onClick={() => handlePayment('nagad')}>
                                🧡 Nagad
                            </button>
                        </div>
                    </div>

                    <div className="grand-total">
                        Total: ${finalTotal.toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    );
}
