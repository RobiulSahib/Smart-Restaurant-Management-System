import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useLanguage } from '../context/LanguageContext';
import './QRLanding.css';

const SOCKET_URL = 'http://localhost:5000';

export default function QRLanding({ onScan, onBack }) {
    const { t } = useLanguage();
    const [socket, setSocket] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [showAssistance, setShowAssistance] = useState(false);
    const [requestStatus, setRequestStatus] = useState(null);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    const handleRequest = (type) => {
        if (!socket) return;
        setRequestStatus(`Sending ${type}...`);
        socket.emit('table_request', {
            tableId: 3,
            type: type,
            timestamp: new Date().toISOString()
        });
        setTimeout(() => {
            setRequestStatus(`✓ ${type} Requested`);
            setTimeout(() => setRequestStatus(null), 3000);
        }, 500);
    };

    return (
        <div className="qr-landing">
            <button className="back-link" onClick={onBack}>
                ← {t.success.home}
            </button>

            {/* Main QR Card */}
            {!scanned ? (
                <div className="qr-card">
                    <div className="qr-frame">
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=RestaurantAppDemoTable03"
                            alt="QR Code for Table 3"
                            className="qr-code"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                        />
                        <div className="qr-fallback" style={{ display: 'none', padding: '20px', textAlign: 'center' }}>
                            <p>QR Code Failed to Load</p>
                            <small>Table 03</small>
                        </div>
                        <div className="scan-line"></div>
                    </div>
                    <p className="scan-text">{t.qr.scanInstruction}</p>
                    <div className="qr-actions">
                        <button className="simulate-btn" onClick={() => setScanned(true)}>
                            {t.qr.simulateBtn}
                        </button>
                    </div>
                </div>
            ) : (
                // Post-Scan View matching Screenshot 1
                <div className="qr-card fade-in-up">
                    <h2 className="table-title">Table 3</h2>

                    <div className="action-area">
                        <button className="menu-btn-pill" onClick={() => onScan(3)}>
                            <span className="btn-icon-circle">🍽️</span>
                            Our Menu & Order
                        </button>
                    </div>

                    <div className="divider-line"></div>

                    <h4 className="assist-title">Need Assistance?</h4>
                    <button className="assist-btn-pill" onClick={() => setShowAssistance(true)}>
                        💁 Request Service
                    </button>
                </div>
            )}

            {/* Assistance Modal matching Screenshot 2 */}
            {showAssistance && (
                <div className="assistance-modal-overlay" onClick={() => setShowAssistance(false)}>
                    <div className="assistance-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-assist" onClick={() => setShowAssistance(false)}>×</button>

                        <h3>Request Service</h3>
                        <div className="subtitle-badge">
                            Tap to notify staff instantly
                        </div>

                        <div className="service-grid">
                            <button onClick={() => handleRequest('Water')} className="service-item">
                                <span className="service-icon">💧</span>
                                <span>Water</span>
                            </button>
                            <button onClick={() => handleRequest('Napkin')} className="service-item">
                                <span className="service-icon">🧻</span>
                                <span>Napkin</span>
                            </button>
                            <button onClick={() => handleRequest('Bill')} className="service-item">
                                <span className="service-icon">🧾</span>
                                <span>Bill</span>
                            </button>
                            <button onClick={() => handleRequest('Waiter')} className="service-item">
                                <span className="service-icon">🔔</span>
                                <span>Call Waiter</span>
                            </button>
                        </div>

                        {requestStatus && <div className="request-toast-inline">{requestStatus}</div>}
                    </div>
                </div>
            )}
        </div>
    );
}
