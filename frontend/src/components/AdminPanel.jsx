import React from 'react';
import { useStaff } from '../context/StaffContext';
import './WaiterPanel.css'; // Reuse basic styles
import PromoManagement from './PromoManagement.jsx';
import StaffChat from './StaffChat.jsx';

export default function AdminPanel({ onBack, onAnalytics }) {
    const { waiters, tables, assignTable, logout } = useStaff();
    const [activeTab, setActiveTab] = React.useState('assignment'); // 'assignment', 'promos', or 'chats'

    const getWaiterTables = (waiterId) => tables.filter(t => t.assignedTo === waiterId);
    const unassignedTables = tables.filter(t => !t.assignedTo);

    return (
        <div className="wp-container admin-theme">
            <div className="wp-header">
                <div className="wp-header-left">
                    <button className="wp-back-btn" onClick={logout}>Logout</button>
                    <span>Admin Dashboard</span>
                </div>
                <button
                    className="wp-config-btn"
                    onClick={() => setActiveTab(activeTab === 'promos' ? 'assignment' : 'promos')}
                    style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', marginRight: '15px' }}
                >
                    {activeTab === 'promos' ? '📋 Assign' : '🎟️ Promos'}
                </button>
                <button
                    className="wp-config-btn"
                    onClick={() => setActiveTab(activeTab === 'chats' ? 'assignment' : 'chats')}
                    style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', marginRight: '15px' }}
                >
                    {activeTab === 'chats' ? '📋 Assign' : '💬 Chats'}
                </button>
                <button
                    className="wp-config-btn"
                    onClick={onAnalytics}
                    style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', marginRight: '15px' }}
                >
                    📊 Stats
                </button>
                <button className="wp-logout" onClick={onBack}>Exit</button>
            </div>

            {activeTab === 'promos' ? (
                <PromoManagement />
            ) : activeTab === 'chats' ? (
                <div style={{ padding: '20px', height: 'calc(100vh - 100px)' }}>
                    <StaffChat />
                </div>
            ) : (
                <div className="admin-grid" style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {/* Unassigned Column */}
                    <div className="admin-column" style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <h3>Unassigned Tables</h3>
                        {unassignedTables.length === 0 && <p style={{ color: '#999' }}>All tables assigned.</p>}
                        {unassignedTables.map(table => (
                            <div key={table.id} className="admin-table-card" style={{ padding: '10px', border: '1px solid #eee', marginBottom: '10px', borderRadius: '5px' }}>
                                <strong>Table {table.id}</strong>
                                <div>
                                    {waiters.filter(w => w.role === 'waiter').map(w => (
                                        <button
                                            key={w.id}
                                            onClick={() => assignTable(table.id, w.id)}
                                            style={{ fontSize: '0.8rem', marginRight: '5px', marginTop: '5px', padding: '2px 8px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Assign {w.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Waiter Columns */}
                    {waiters.filter(w => w.role === 'waiter').map(waiter => (
                        <div key={waiter.id} className="admin-column" style={{ background: '#fff', padding: '15px', borderRadius: '8px', borderTop: `4px solid ${waiter.color}`, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ color: waiter.color }}>{waiter.name}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>{getWaiterTables(waiter.id).length} Tables</p>

                            {getWaiterTables(waiter.id).map(table => (
                                <div key={table.id} className="admin-table-card" style={{ padding: '10px', background: '#f9f9f9', marginBottom: '10px', borderRadius: '5px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <strong>Table {table.id}</strong>
                                        <span style={{ fontSize: '0.8rem', color: table.status === 'free' ? 'green' : 'red' }}>
                                            {table.status}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                                        {table.orders.length} orders
                                    </div>
                                    <div style={{ marginTop: '5px' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#999' }}>Move to: </span>
                                        {waiters.filter(w => w.id !== waiter.id && w.role === 'waiter').map(target => (
                                            <button
                                                key={target.id}
                                                onClick={() => assignTable(table.id, target.id)}
                                                style={{ fontSize: '0.7rem', border: 'none', background: '#eee', margin: '0 2px', padding: '2px 5px', borderRadius: '3px', cursor: 'pointer' }}
                                            >
                                                {target.name}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => assignTable(table.id, null)}
                                            style={{ fontSize: '0.7rem', border: 'none', background: '#ffebee', color: 'red', margin: '0 2px', padding: '2px 5px', borderRadius: '3px', cursor: 'pointer' }}
                                        >
                                            Unassign
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
