import React, { useState } from 'react';
import './Header.css';
import { useLanguage } from '../context/LanguageContext';

export default function Header({ onQRClick, onReservationClick, onLoyaltyClick, onStaffClick, onHomeClick }) {
    const [isOpen, setIsOpen] = useState(false);
    const { language, toggleLanguage, t } = useLanguage();

    const handleHome = (e) => {
        e.preventDefault();
        setIsOpen(false);
        if (onHomeClick) onHomeClick();
    };

    return (
        <header className="site-header">
            <div className="header-content">
                <div className="logo" onClick={handleHome} style={{ cursor: 'pointer' }}>RestoApp</div>

                <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                    ☰
                </button>

                <nav className={`nav-container ${isOpen ? 'open' : ''}`}>
                    <ul className="nav-links">
                        <li><a href="#home" className="active" onClick={handleHome}>{t.nav.home}</a></li>
                        <li><a href="#menu" onClick={() => setIsOpen(false)}>{t.nav.menu}</a></li>
                        <li><a href="#cart" onClick={() => setIsOpen(false)}>{t.nav.cart}</a></li>
                        <li><a href="#order" onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(false);
                            if (onQRClick) onQRClick();
                        }}>
                            {t.nav.order}
                        </a>
                        </li>
                        <li><a href="#reservation" onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(false);
                            if (onReservationClick) onReservationClick();
                        }}>{t.nav.reservation}</a></li>
                        <li><a href="#loyalty" onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(false);
                            if (onLoyaltyClick) onLoyaltyClick();
                        }}>{t.nav.loyalty}</a></li>
                    </ul>
                </nav>

                <div className="lang-toggle" onClick={toggleLanguage}>
                    <span className={language === 'en' ? 'active-lang' : ''}>EN</span>
                    |
                    <span className={language === 'bn' ? 'active-lang' : ''}>BN</span>
                </div>
            </div>
        </header>
    );
}
