import React, { useState, useEffect } from 'react';
import './KitchenDashboard.css';
import io from 'socket.io-client';
import { API_URL } from '../config';

const socket = io(API_URL);

export default function KitchenDashboard({ onBack }) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Fetch initial active orders
        fetch(`${API_URL}/api/orders?kds=true`)
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.error("Failed to load orders", err));

        // Listen for new orders
        socket.on('order:new', (newOrder) => {
            if (newOrder.status === 'PENDING' || newOrder.status === 'COOKING') {
                setOrders(prev => [...prev, newOrder]);
            }
        });

        // Listen for updates (from other KDS screens maybe)
        socket.on('order:status_update', (updatedOrder) => {
            setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
            // Remove if COMPLETED/CANCELLED immediately, or SERVED after delay
            if (['COMPLETED', 'CANCELLED'].includes(updatedOrder.status)) {
                setOrders(prev => prev.filter(o => o._id !== updatedOrder._id));
            } else if (updatedOrder.status === 'SERVED') {
                setTimeout(() => {
                    setOrders(prev => prev.filter(o => o._id !== updatedOrder._id));
                }, 5000); // Keep visible for 5 seconds
            }
        });

        return () => {
            socket.off('order:new');
            socket.off('order:status_update');
        };
    }, []);

    const updateStatus = (orderId, status) => {
        socket.emit('order:update_status', { orderId, status });

        // Optimistic Update
        setOrders(prev => prev.map(o => {
            if (o._id === orderId) return { ...o, status };
            return o;
        }));
    };

    return (
        <div className="kds-container">
            <header className="kds-header">
                <div>
                    <h1>👨‍🍳 Kitchen Display System</h1>
                    <p>Live Orders • {orders.length} Active</p>
                </div>
                <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #666', color: '#aaa', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                    Exit
                </button>
            </header>

            <div className="kds-grid">
                {orders.map(order => (
                    <OrderCard
                        key={order._id}
                        order={order}
                        onUpdateStatus={updateStatus}
                    />
                ))}
                {orders.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#555' }}>
                        <h2>No Active Orders</h2>
                        <p>Waiting for new orders...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function OrderCard({ order, onUpdateStatus }) {
    const [elapsed, setElapsed] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const diff = Math.floor((new Date() - new Date(order.createdAt)) / 1000);
            const m = Math.floor(diff / 60);
            const s = diff % 60;
            setElapsed(`${m}:${s < 10 ? '0' : ''}${s}`);
        }, 1000);
        return () => clearInterval(interval);
    }, [order.createdAt]);

    return (
        <div className={`kds-card ${order.status.toLowerCase()}`}>
            <div className="card-header">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{
                        background: order.tableId ? '#444' : '#007bff',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '800',
                        color: 'white'
                    }}>
                        {order.tableId ? `TABLE ${order.tableId}` : `ORDER #${order._id.toString().slice(-4)}`}
                    </span>
                    <span className="customer-name" style={{ fontSize: '0.9rem', color: '#fff', marginTop: '6px', fontWeight: 'bold' }}>
                        👤 {order.customerName}
                    </span>
                </div>
                <span className="timer-badge">⏱ {elapsed}</span>
            </div>

            <div className="kds-items">
                {order.items.map((item, idx) => (
                    <div key={idx} className="kds-item-row">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className="item-qty">{item.quantity}</span>
                            <span>{item.name || item.title || 'Unknown Item'}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="kds-actions">
                {order.status === 'PENDING' && (
                    <button
                        className="kds-btn btn-start"
                        onClick={() => onUpdateStatus(order._id, 'COOKING')}
                    >
                        Start Cooking 🔥
                    </button>
                )}
                {order.status === 'COOKING' && (
                    <button
                        className="kds-btn btn-ready"
                        onClick={() => onUpdateStatus(order._id, 'READY')}
                    >
                        Mark Ready ✅
                    </button>
                )}
                {(order.status === 'READY' || order.status === 'SERVED') && (
                    <div className={`kds-status-info ${order.status.toLowerCase()}`}>
                        {order.status === 'READY' ? (
                            <span className="waiting-text">⌛ WAITING FOR PICKUP</span>
                        ) : (
                            <span className="delivered-text">✅ DELIVERED BY: <strong>{order.servedBy || 'Waiter'}</strong></span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
