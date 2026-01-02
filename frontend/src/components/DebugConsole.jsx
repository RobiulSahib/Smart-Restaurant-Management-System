import React, { useState } from 'react';
import { useCustomer } from '../context/CustomerContext';

export default function DebugConsole({ currentView }) {
    const { currentCustomer } = useCustomer();
    const [isOpen, setIsOpen] = useState(false);

    // Toggle Button Style
    const toggleBtnStyle = {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    };

    // Panel Style
    const panelStyle = {
        position: 'fixed',
        bottom: '70px',
        left: '20px',
        background: 'rgba(20, 20, 20, 0.95)',
        color: '#eee',
        padding: '15px',
        borderRadius: '12px',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 900,
        width: '250px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'opacity 0.2s, transform 0.2s',
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(10px)',
        pointerEvents: isOpen ? 'auto' : 'none',
    };

    return (
        <>
            <button style={toggleBtnStyle} onClick={() => setIsOpen(!isOpen)} title="Debug Console">
                {isOpen ? '✕' : '🛠'}
            </button>

            <div style={panelStyle}>
                <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #444', paddingBottom: '5px', color: '#fff' }}>
                    Debug Console
                </h4>

                <div style={{ marginBottom: '8px' }}>
                    <div style={{ color: '#888' }}>Current Route</div>
                    <div style={{ color: '#4caf50', fontWeight: 'bold' }}>{currentView}</div>
                </div>

                <div style={{ marginBottom: '8px' }}>
                    <div style={{ color: '#888' }}>Active Customer</div>
                    {currentCustomer ? (
                        <div>
                            <span style={{ color: '#fff' }}>{currentCustomer.name}</span>
                            <div style={{ fontSize: '10px', color: '#aaa' }}>{currentCustomer.phoneNumber}</div>
                        </div>
                    ) : (
                        <span style={{ color: '#f44336' }}>Not Identified</span>
                    )}
                </div>

                {currentCustomer && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#888' }}>Tier</span>
                            <span style={{ color: getTierColor(currentCustomer.tier), fontWeight: 'bold' }}>
                                {currentCustomer.tier}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#888' }}>Points</span>
                            <span style={{ color: '#4fc3f7', fontWeight: 'bold' }}>{currentCustomer.points}</span>
                        </div>
                        <div style={{ marginTop: '5px', fontSize: '10px', color: '#666' }}>
                            History: {currentCustomer.history?.length || 0} txns
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function getTierColor(tier) {
    switch (tier) {
        case 'Gold': return '#ffd700';
        case 'Platinum': return '#00bfff';
        default: return '#c0c0c0';
    }
}
