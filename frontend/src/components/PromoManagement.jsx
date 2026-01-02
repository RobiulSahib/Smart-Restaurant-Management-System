import React, { useState, useEffect } from 'react';

export default function PromoManagement() {
    const [promos, setPromos] = useState([]);
    const [newPromo, setNewPromo] = useState({ code: '', discountType: 'PERCENT', discountValue: 0, isActive: true });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPromos();
    }, []);

    const fetchPromos = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/promos');
            const data = await res.json();
            setPromos(data);
        } catch (error) {
            console.error('Error fetching promos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/promos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPromo)
            });
            if (res.ok) {
                fetchPromos();
                setNewPromo({ code: '', discountType: 'PERCENT', discountValue: 0, isActive: true });
            }
        } catch (error) {
            console.error('Error creating promo:', error);
        }
    };

    const handleToggleActive = async (id, currentStatus) => {
        try {
            await fetch(`http://localhost:5000/api/promos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            fetchPromos();
        } catch (error) {
            console.error('Error updating promo:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this promo code?')) return;
        try {
            await fetch(`http://localhost:5000/api/promos/${id}`, { method: 'DELETE' });
            fetchPromos();
        } catch (error) {
            console.error('Error deleting promo:', error);
        }
    };

    return (
        <div className="promo-mgmt" style={{ padding: '20px' }}>
            <h3>Promo Code Management</h3>

            <form onSubmit={handleCreate} style={{ marginBottom: '30px', background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="CODE (e.g. SAVE20)"
                        value={newPromo.code}
                        onChange={e => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                        required
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <select
                        value={newPromo.discountType}
                        onChange={e => setNewPromo({ ...newPromo, discountType: e.target.value })}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="PERCENT">Percentage (%)</option>
                        <option value="FLAT">Flat Amount ($)</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Value"
                        value={newPromo.discountValue}
                        onChange={e => setNewPromo({ ...newPromo, discountValue: e.target.value })}
                        required
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '80px' }}
                    />
                    <button type="submit" style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Add Promo
                    </button>
                </div>
            </form>

            {loading ? <p>Loading promos...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                    {promos.map(promo => (
                        <div key={promo._id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', background: promo.isActive ? 'white' : '#f9f9f9', opacity: promo.isActive ? 1 : 0.7 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <strong style={{ fontSize: '1.2rem', color: '#333' }}>{promo.code}</strong>
                                <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', background: promo.isActive ? '#e8f5e9' : '#ffebee', color: promo.isActive ? '#2e7d32' : '#c62828' }}>
                                    {promo.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>
                                {promo.discountType === 'PERCENT' ? `${promo.discountValue}% Off` : `$${promo.discountValue} Off`}
                            </p>
                            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => handleToggleActive(promo._id, promo.isActive)}
                                    style={{ flex: 1, padding: '5px', fontSize: '0.8rem', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '4px', background: 'white' }}
                                >
                                    {promo.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                    onClick={() => handleDelete(promo._id)}
                                    style={{ padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', border: 'none', borderRadius: '4px', background: '#ffebee', color: '#c62828' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {promos.length === 0 && <p style={{ color: '#999' }}>No promo codes yet.</p>}
                </div>
            )}
        </div>
    );
}
