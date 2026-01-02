import React, { useState } from 'react';
import { useStaff } from '../context/StaffContext';
import AdminPanel from './AdminPanel';
import BillingPage from './BillingPage';
import StaffChat from './StaffChat';
import './WaiterPanel.css';

const MOCK_MENU = [
    { id: 1, name: 'Burger', price: 12 },
    { id: 2, name: 'Pizza', price: 15 },
    { id: 3, name: 'Salad', price: 10 },
    { id: 4, name: 'Coke', price: 3 },
    { id: 5, name: 'Coffee', price: 4 },
    { id: 6, name: 'Fries', price: 5 }
];

export default function WaiterPanel({ onBack, onAnalytics }) {
    const {
        waiters,
        tables,
        currentUser,
        login,
        logout,
        addOrder,
        markItemServed,
        markOrderServed,
        assignTable,
        notifications, // Get notifications
        resolveRequest // Get resolve action
    } = useStaff();

    const [screen, setScreen] = useState('login'); // dashboard, detail, menu, requests, billing
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [transferMode, setTransferMode] = useState(false);

    // Auth State
    const [passModalOpen, setPassModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [pendingUserId, setPendingUserId] = useState(null);

    // All users require password now
    const handleUserClick = (user) => {
        setPendingUserId(user.id);
        setPassModalOpen(true);
        setAuthError('');
        setPassword('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const user = waiters.find(w => w.id === pendingUserId);
        if (user && password === user.password) {
            login(pendingUserId);
            setPassModalOpen(false);
        } else {
            setAuthError('Invalid Password');
        }
    };

    if (!currentUser) {
        // ... (Keep existing login UI)
        return (
            <div className="wp-login">
                <div className="login-card">
                    <h2>Staff Portal</h2>

                    {!passModalOpen ? (
                        <div className="wp-user-grid">
                            {waiters.map(user => (
                                <button
                                    key={user.id}
                                    className="wp-user-btn"
                                    style={{ '--user-color': user.color }}
                                    onClick={() => handleUserClick(user)}
                                >
                                    <div className="wp-avatar">{user.name[0]}</div>
                                    <div className="wp-user-info">
                                        <span className="name">{user.name}</span>
                                        <span className="role">{user.role}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="admin-auth-box">
                            <h3>Staff Login</h3>
                            <p>Enter password for {waiters.find(w => w.id === pendingUserId)?.name || 'Staff'}</p>
                            <form onSubmit={handleLogin}>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter Password"
                                    autoFocus
                                />
                                {authError && <div className="error-msg">{authError}</div>}
                                <div className="auth-actions">
                                    <button type="button" onClick={() => setPassModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="confirm-btn">Login</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (currentUser.role === 'admin') {
        return <AdminPanel onBack={onBack} onAnalytics={onAnalytics} />;
    }

    // WAITER VIEW LOGIC
    const myTables = tables.filter(t => t.assignedTo === currentUser.id);
    const selectedTable = tables.find(t => t.id === selectedTableId);

    const handleTableClick = (tableId) => {
        setSelectedTableId(tableId);
        setScreen('detail');
    };

    const handleAddItem = (item) => {
        addOrder(selectedTableId, item);
        setScreen('detail');
    };

    const handleTransfer = (targetWaiter) => {
        assignTable(selectedTableId, targetWaiter.id);
        setTransferMode(false);
        setScreen('dashboard');
    };

    // Switch to Billing
    const handleBilling = () => {
        setScreen('billing');
    };

    return (
        <div className="wp-container">
            {/* Header */}
            <div className="wp-header">
                <div className="wp-header-left">
                    {screen !== 'dashboard' && (
                        <button className="wp-back-btn" onClick={() => setScreen(screen === 'menu' || screen === 'billing' ? 'detail' : 'dashboard')}>
                            ← Back
                        </button>
                    )}
                    {screen === 'dashboard' && <span style={{ fontWeight: 'bold', color: currentUser.color }}>Hi, {currentUser.name}</span>}
                </div>
                <div className="wp-header-title">
                    {screen === 'requests' ? 'Service Requests' :
                        screen === 'billing' ? 'POS System' :
                            (screen === 'dashboard' ? 'My Tables' : `Table ${selectedTableId}`)}
                </div>
                <div className="wp-header-right">
                    {screen === 'dashboard' && (
                        <button
                            className="wp-config-btn"
                            onClick={onAnalytics}
                            style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', marginRight: '15px' }}
                        >
                            📊 Stats
                        </button>
                    )}
                    {/* Notification Bell */}
                    <button
                        className="wp-notif-btn"
                        onClick={() => setScreen(screen === 'requests' ? 'dashboard' : 'requests')}
                        style={{ position: 'relative', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', marginRight: '15px' }}
                    >
                        🔔
                        {notifications && notifications.length > 0 && (
                            <span style={{
                                position: 'absolute', top: '-5px', right: '-5px',
                                background: 'red', color: 'white',
                                borderRadius: '50%', fontSize: '0.7rem',
                                width: '18px', height: '18px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {notifications.length}
                            </span>
                        )}
                    </button>
                    {/* Chat Monitor Button */}
                    <button
                        className="wp-chat-monitor-btn"
                        onClick={() => setScreen(screen === 'chats' ? 'dashboard' : 'chats')}
                        style={{ position: 'relative', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', marginRight: '15px' }}
                    >
                        💬
                    </button>
                    {screen === 'dashboard' && (
                        <button className="wp-logout" onClick={logout}>Logout</button>
                    )}
                </div>
            </div>

            {/* REQUESTS SCREEN */}
            {screen === 'requests' && (
                <div className="wp-requests-list" style={{ padding: '20px' }}>
                    {notifications && notifications.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>
                            <p>No active requests.</p>
                        </div>
                    ) : (
                        notifications && notifications.map(req => (
                            <div key={req.id} style={{
                                background: 'white', padding: '15px', borderRadius: '12px',
                                marginBottom: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                borderLeft: '5px solid #ff6b6b'
                            }}>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Table {req.tableId}</h4>
                                    <p style={{ margin: '5px 0 0', color: '#666' }}>Requesting: <strong>{req.type}</strong></p>
                                    <small style={{ color: '#999' }}>{new Date(req.time).toLocaleTimeString()}</small>
                                </div>
                                <button
                                    onClick={() => resolveRequest(req.id)}
                                    style={{
                                        background: '#51cf66', color: 'white', border: 'none',
                                        padding: '8px 15px', borderRadius: '50px', fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ✓ Done
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Dashboard */}
            {screen === 'dashboard' && (
                <div className="wp-grid">
                    {/* ... (keep existing dashboard code) ... */}
                    {myTables.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#888' }}>
                            <p>No tables assigned.</p>
                            <p style={{ fontSize: '0.9rem' }}>Ask Admin to assign tables.</p>
                        </div>
                    )}
                    {myTables.map(table => (
                        <div
                            key={table.id}
                            className={`wp-card table-card ${table.status}`}
                            onClick={() => handleTableClick(table.id)}
                        >
                            <div className="wp-card-top">
                                <span className="table-num">T{table.id}</span>
                                <span className="guest-badge">👥 {table.guests}</span>
                            </div>
                            <div className="wp-card-body">
                                <div className="status-dot"></div>
                                <span className="status-text">{table.status.toUpperCase()}</span>
                            </div>
                            <div className="wp-card-footer">
                                {table.orders.filter(o => o.status === 'pending').length} pending items
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail View */}
            {screen === 'detail' && selectedTable && (
                // ... (Keep existing detail view) ...
                <div className="wp-detail">
                    <div className="wp-actions-bar">
                        <button className="action-btn add-btn" onClick={() => setScreen('menu')}>
                            + Add Items
                        </button>
                        <button className="action-btn transfer-btn" onClick={() => setTransferMode(!transferMode)}>
                            ⇄ Transfer
                        </button>
                        <button
                            className="action-btn bill-btn"
                            style={{ background: '#333', color: 'white' }}
                            onClick={handleBilling}
                        >
                            💳 Billing / POS
                        </button>
                    </div>

                    {transferMode && (
                        <div className="transfer-dropdown">
                            <p>Select Waiter:</p>
                            {waiters.filter(w => w.id !== currentUser.id && w.role === 'waiter').map(w => (
                                <button key={w.id} onClick={() => handleTransfer(w)}>
                                    {w.name}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="order-list">
                        <h4>Current Orders</h4>
                        {selectedTable.orders.length === 0 ? (
                            <p className="empty-msg">No orders yet.</p>
                        ) : (
                            selectedTable.orders.map((order, idx) => (
                                <div key={idx} className={`order-row ${order.status}`}>
                                    <div className="order-info">
                                        <span className="qty">{order.qty || 1}x</span>
                                        <span className="item-name">{order.name || order.title || 'Unknown Item'}</span>
                                    </div>
                                    {order.status === 'ready' || order.status === 'served' ? (
                                        <div className="order-actions">
                                            {order.status === 'ready' && (
                                                <button
                                                    className="serve-btn"
                                                    onClick={() => {
                                                        markItemServed(selectedTable.id, order.id);
                                                        markOrderServed(order.id);
                                                    }}
                                                >
                                                    Serve
                                                </button>
                                            )}
                                            {order.status === 'served' && (
                                                <span className="served-badge">✓ Served</span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className={`status-badge ${order.status}`}>{order.status}</span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Menu View */}
            {screen === 'menu' && (
                <div className="wp-menu-grid">
                    {MOCK_MENU.map(item => (
                        <button key={item.id} className="menu-btn" onClick={() => handleAddItem(item)}>
                            <span className="menu-name">{item.name}</span>
                            <span className="menu-price">${item.price}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Billing View */}
            {screen === 'billing' && selectedTable && (
                <BillingPage
                    tableId={selectedTableId}
                    onBack={() => setScreen('detail')}
                    onComplete={() => setScreen('dashboard')}
                />
            )}

            {/* Chat Monitor View */}
            {screen === 'chats' && (
                <div style={{ padding: '20px', height: 'calc(100vh - 100px)' }}>
                    <StaffChat />
                </div>
            )}
        </div>
    );
}
