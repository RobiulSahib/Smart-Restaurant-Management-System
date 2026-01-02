import React from 'react';
import './MenuFilters.css';

export default function MenuFilters({ filters, onFilterChange }) {
    const dietaryOptions = [
        { key: 'isVegan', label: 'Vegan 🌿', color: '#10b981' },
        { key: 'isHalal', label: 'Halal ☪️', color: '#059669' },
        { key: 'nutFree', label: 'Nut-Free 🥜', color: '#d97706' },
        { key: 'dairyFree', label: 'Dairy-Free 🥛', color: '#2563eb' }
    ];

    const spiceOptions = [
        { value: 'Low', label: 'Mild 🌶️' },
        { value: 'Medium', label: 'Medium 🌶️🌶️' },
        { value: 'High', label: 'Hot 🌶️🌶️🌶️' }
    ];

    const toggleFilter = (key) => {
        onFilterChange({ ...filters, [key]: !filters[key] });
    };

    const setSpice = (level) => {
        onFilterChange({ ...filters, spiceLevel: filters.spiceLevel === level ? '' : level });
    };

    const clearFilters = () => {
        onFilterChange({
            isVegan: false,
            isHalal: false,
            nutFree: false,
            dairyFree: false,
            spiceLevel: ''
        });
    };

    const activeCount = Object.values(filters).filter(v => v === true || (typeof v === 'string' && v !== '')).length;

    return (
        <div className="filters-bar">
            <div className="filters-header">
                <span className="filters-title">Dietary Preferences</span>
                {activeCount > 0 && (
                    <button className="clear-filters-btn" onClick={clearFilters}>
                        Clear All ({activeCount})
                    </button>
                )}
            </div>

            <div className="filters-scroll">
                <div className="filter-group">
                    {dietaryOptions.map(opt => (
                        <button
                            key={opt.key}
                            className={`filter-chip ${filters[opt.key] ? 'active' : ''}`}
                            onClick={() => toggleFilter(opt.key)}
                            style={{ '--chip-color': opt.color }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <div className="filter-divider"></div>

                <div className="filter-group">
                    {spiceOptions.map(opt => (
                        <button
                            key={opt.value}
                            className={`filter-chip spice-chip ${filters.spiceLevel === opt.value ? 'active' : ''}`}
                            onClick={() => setSpice(opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
