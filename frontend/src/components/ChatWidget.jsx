import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useCustomer } from '../context/CustomerContext';
import './ChatWidget.css';

const SOCKET_URL = 'http://localhost:5000';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! We're online. message us!", sender: 'admin' }
    ]);
    const [inputText, setInputText] = useState('');
    const [hasUnread, setHasUnread] = useState(true);

    // Auth State
    const { currentCustomer, login, logout } = useCustomer();
    const [loginForm, setLoginForm] = useState({ name: '', phone: '' });

    const socketRef = useRef();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Init Socket
        socketRef.current = io(SOCKET_URL);

        socketRef.current.on('connect', () => {
            console.log('Chat connected:', socketRef.current.id);
        });

        socketRef.current.on('admin_reply', (msg) => {
            setMessages(prev => [...prev, { id: Date.now(), text: msg, sender: 'admin' }]);
            if (!isOpen) setHasUnread(true);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [isOpen]);

    useEffect(() => {
        // Scroll to bottom
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            setHasUnread(false);
        }
    }, [messages, isOpen]);

    // Reset Chat when User Changes
    useEffect(() => {
        setMessages([
            { id: 1, text: `Hi ${currentCustomer ? currentCustomer.name : 'there'}! We're online.`, sender: 'admin' }
        ]);
    }, [currentCustomer?.phone]); // Depend on PHONE to detect user switch

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const msg = inputText.trim();
        // Optimistic UI
        setMessages(prev => [...prev, { id: Date.now(), text: msg, sender: 'user' }]);

        // Send to Server with User Info
        const activeUser = currentCustomer || { name: 'Guest', phone: 'Unknown' };
        socketRef.current.emit('customer_message', {
            text: msg,
            user: {
                name: activeUser.name,
                phone: activeUser.phone
            }
        });

        setInputText('');
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (loginForm.name && loginForm.phone) {
            login(loginForm.phone, loginForm.name);
        }
    };

    return (
        <div className="chat-widget-container">
            {/* Chat Float Button */}
            <button
                className={`chat-toggle-btn ${hasUnread ? 'unread' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '❌' : '💬'}
                {!isOpen && hasUnread && <span className="notification-dot"></span>}
            </button>

            {/* Chat Window */}
            <div className={`chat-window ${isOpen ? 'open' : ''}`}>
                <div className="chat-header">
                    <div className="chat-avatar">👩‍💼</div>
                    <div className="chat-header-info">
                        <h4>Support</h4>
                        <span className="status-indicator">
                            {currentCustomer ? `👤 ${currentCustomer.name}` : '● Online'}
                        </span>
                    </div>
                    {currentCustomer && (
                        <button
                            onClick={(e) => { e.stopPropagation(); logout(); }}
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.5)',
                                color: 'white',
                                borderRadius: '4px',
                                padding: '2px 6px',
                                fontSize: '0.7rem',
                                cursor: 'pointer',
                                marginLeft: 'auto'
                            }}
                        >
                            Logout
                        </button>
                    )}
                </div>

                {!currentCustomer ? (
                    <div className="chat-login">
                        <p>Please introduce yourself to start chatting! 👋</p>
                        <form onSubmit={handleLoginSubmit}>
                            <input
                                type="text"
                                placeholder="Your Name"
                                required
                                value={loginForm.name}
                                onChange={e => setLoginForm({ ...loginForm, name: e.target.value })}
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                required
                                value={loginForm.phone}
                                onChange={e => setLoginForm({ ...loginForm, phone: e.target.value })}
                            />
                            <button type="submit">Start Chatting</button>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="chat-messages">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                                    {msg.text}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="chat-input-area" onSubmit={handleSend}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <button type="submit">➤</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
