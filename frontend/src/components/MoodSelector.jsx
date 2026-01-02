import React from 'react';
import './MoodSelector.css';

const MOODS = [
    { id: 'Light', label: 'Light', icon: '🥗', color: '#51cf66', description: 'Fresh & Healthy' },
    { id: 'Spicy', label: 'Spicy', icon: '🌶️', color: '#ff6b6b', description: 'Bold & Fiery' },
    { id: 'Comfort', label: 'Comfort', icon: '🍲', color: '#4dabf7', description: 'Warm & Cozy' },
    { id: 'Sweet', label: 'Sweet', icon: '🍰', color: '#f06595', description: 'Small Treats' }
];

export default function MoodSelector({ selectedMood, onSelectMood }) {
    return (
        <div className="mood-selector-container">
            <h3 className="mood-title">How's your mood today?</h3>
            <div className="mood-grid">
                {MOODS.map((mood) => (
                    <button
                        key={mood.id}
                        className={`mood-card ${selectedMood === mood.id ? 'active' : ''}`}
                        onClick={() => onSelectMood(mood.id)}
                        style={{ '--mood-color': mood.color }}
                    >
                        <span className="mood-icon">{mood.icon}</span>
                        <div className="mood-info">
                            <span className="mood-label">{mood.label}</span>
                            <span className="mood-desc">{mood.description}</span>
                        </div>
                    </button>
                ))}
            </div>
            {selectedMood && (
                <button className="clear-mood" onClick={() => onSelectMood(null)}>
                    Clear Mood Filter
                </button>
            )}
        </div>
    );
}
