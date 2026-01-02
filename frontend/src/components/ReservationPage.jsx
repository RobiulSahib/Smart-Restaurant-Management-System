import React, { useState, useEffect } from 'react';
import './ReservationPage.css';
import { useLanguage } from '../context/LanguageContext';
import { useCustomer } from '../context/CustomerContext';

const INITIAL_TABLES = [
    { id: 1, seats: 2, status: 'available', x: 20, y: 20 },
    { id: 2, seats: 4, status: 'available', x: 50, y: 20 },
    { id: 3, seats: 4, status: 'reserved', x: 80, y: 20 },
    { id: 4, seats: 6, status: 'occupied', x: 20, y: 50 },
    { id: 5, seats: 2, status: 'available', x: 50, y: 50 },
    { id: 6, seats: 6, status: 'available', x: 80, y: 50 },
];

export default function ReservationPage({ onBack }) {
    const { t } = useLanguage();
    const { currentCustomer, requireAuth } = useCustomer();

    // Safe Initialization
    const [tables, setTables] = useState(INITIAL_TABLES);
    const [selectedTable, setSelectedTable] = useState(null);
    const [step, setStep] = useState('map'); // 'map', 'form', 'success'
    const [formData, setFormData] = useState({ name: '', phone: '', date: '', time: '' });
    const [bookingCode, setBookingCode] = useState(null);
    const [countdown, setCountdown] = useState(null);

    useEffect(() => {
        if (!currentCustomer) {
            // Trigger auth immediately if missing
            const timer = setTimeout(() => {
                requireAuth(() => { });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [currentCustomer, requireAuth]);

    // Safety Wrapper: Never render content if no customer
    if (!currentCustomer) {
        return (
            <div className="reservation-container">
                <button className="back-link" onClick={onBack} style={{ float: 'left', marginBottom: '1rem' }}>
                    ← {t.success.home}
                </button>
                <div style={{ clear: 'both' }}></div>
                <div className="loading-state" style={{
                    textAlign: 'center',
                    padding: '3rem',
                    background: '#f9f9f9',
                    borderRadius: '12px',
                    marginTop: '2rem'
                }}>
                    <h3>Identification Required</h3>
                    <p>Please enter your phone number to continue with reservations.</p>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>Packet ID: RES-AUTH-WAIT</p>
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && step === 'success') {
            resetBooking();
        }
    }, [countdown, step]);

    const handleTableClick = (table) => {
        if (table.status === 'available') {
            setSelectedTable(table);
            setStep('form');
        }
    };

    const handleBook = (e) => {
        e.preventDefault();
        const code = 'RES-' + Math.floor(1000 + Math.random() * 9000);
        setBookingCode(code);

        setTables(prev => prev.map(t =>
            t.id === selectedTable.id ? { ...t, status: 'reserved' } : t
        ));

        setStep('success');
        setCountdown(30);
    };

    const resetBooking = () => {
        setStep('map');
        setSelectedTable(null);
        setFormData({ name: '', phone: '', date: '', time: '' });
        setCountdown(null);
    };

    return (
        <div className="reservation-container">
            <button className="back-link" onClick={onBack} style={{ float: 'left', marginBottom: '1rem' }}>
                ← {t.success.home}
            </button>
            <div style={{ clear: 'both' }}></div>

            <h2 className="page-title">{t.reservation.title}</h2>

            {step === 'map' && (
                <>
                    <p className="instruction">{t.reservation.instruction}</p>
                    <div className="legend">
                        <span className="dot available"></span> {t.reservation.legend.available}
                        <span className="dot reserved"></span> {t.reservation.legend.reserved}
                        <span className="dot occupied"></span> {t.reservation.legend.occupied}
                    </div>

                    <div className="floor-plan">
                        {tables.map(table => (
                            <button
                                key={table.id}
                                className={`table-node ${table.status}`}
                                style={{ top: `${table.y}%`, left: `${table.x}%` }}
                                onClick={() => handleTableClick(table)}
                                disabled={table.status !== 'available'}
                            >
                                <span className="table-seats">{table.seats}</span>
                                <span className="table-id">T{table.id}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}

            {step === 'form' && selectedTable && (
                <div className="reservation-modal">
                    <h3>{t.reservation.formTitle} - {t.reservation.tables[`t${selectedTable.id}`]}</h3>
                    <form onSubmit={handleBook}>
                        <div className="form-group">
                            <label>{t.reservation.name}</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>{t.reservation.phone}</label>
                            <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div className="row">
                            <div className="form-group">
                                <label>{t.reservation.date}</label>
                                <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{t.reservation.time}</label>
                                <input required type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setStep('map')}>{t.reservation.cancelBtn}</button>
                            <button type="submit" className="confirm-btn">{t.reservation.bookBtn}</button>
                        </div>
                    </form>
                </div>
            )}

            {step === 'success' && (
                <div className="success-view">
                    <div className="success-content">
                        <div className="check-icon">✓</div>
                        <h3>{t.reservation.successTitle}</h3>
                        <div className="booking-code">
                            <p>{t.reservation.code}</p>
                            <strong>{bookingCode}</strong>
                        </div>

                        {countdown > 0 && (
                            <p className="timer-alert">
                                {t.reservation.autoCancel}: {countdown}s
                            </p>
                        )}

                        <div className="mock-sms">
                            <div className="sms-bubble">
                                <p>
                                    Conf: Table {selectedTable.id} reserved for {formData.date} at {formData.time}.
                                    Code: {bookingCode}. See you soon! - RestoApp
                                </p>
                            </div>
                        </div>

                        <button className="home-btn" onClick={resetBooking}>{t.success.home}</button>
                    </div>
                </div>
            )}
        </div>
    );
}
