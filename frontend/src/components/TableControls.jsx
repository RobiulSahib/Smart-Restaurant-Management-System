import React from 'react';
import './TableControls.css';
import { useLanguage } from '../context/LanguageContext';

export default function TableControls({ tableId, activeOrder, onViewStatus, onRequestWaiter, onToggleStock }) {
    const { t } = useLanguage();

    if (!tableId && !activeOrder) return null;

    // Simplified view for Online Tracking
    if (!tableId && activeOrder) {
        return (
            <div className="table-controls-bar online-tracker">
                <button className="track-order-btn" onClick={onViewStatus} style={{ width: '100%', justifyContent: 'center' }}>
                    <span className="pulse-dot"></span>
                    Track My Order: <strong>{activeOrder.status}</strong>
                </button>
            </div>
        );
    }

    return (
        <div className="table-controls-bar">
            {activeOrder && (
                <button className="track-order-btn" onClick={onViewStatus}>
                    <span className="pulse-dot"></span>
                    Track Order: <strong>{activeOrder.status}</strong>
                </button>
            )}

            <div className="table-info">
                <span className="table-label">{t.qr.table}</span>
                <span className="table-number">{tableId.toString().padStart(2, '0')}</span>
            </div>

            <div className="table-actions">
                <button className="waiter-btn" onClick={() => onRequestWaiter(tableId)}>
                    🔔 {t.qr.requestWaiter}
                </button>

                <button className="stock-btn" onClick={onToggleStock}>
                    ⚡ {t.qr.toggleStock}
                </button>
            </div>
        </div>
    );
}
