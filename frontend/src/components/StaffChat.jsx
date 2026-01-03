import React, { useState, useEffect } from 'react';
import './StaffChat.css';
import io from 'socket.io-client';
import { API_URL } from '../config';

const socket = io(API_URL);

export default function StaffChat() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch(`${API_URL}/api/chat/history`);
                const data = await response.json();
                setMessages(data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch chat history:', err);
                setLoading(false);
            }
        };

        fetchHistory();

        socket.on('staff:new_message', (msg) => {
            setMessages(prev => {
                if (prev.find(m => m._id === msg._id)) return prev;
                const updated = [msg, ...prev];
                return updated.sort((a, b) => b.priority - a.priority || new Date(b.timestamp) - new Date(a.timestamp));
            });
        });

        return () => socket.off('staff:new_message');
    }, []);

    const getMoodColor = (mood) => {
        switch (mood) {
            case 'Angry': return '#ff0000';
            case 'Happy': return '#00aa00';
            default: return '#ffaa00';
        }
    };

    if (loading) return <div className="mod-loading">Loading chats...</div>;

    return (
        <div className="mod-staff-chat-container">
            <div className="mod-chat-container-header">
                <h2>💬 Customer Mood Monitor</h2>
                <span className="mod-live-badge">LIVE</span>
            </div>

            <div className="mod-chat-scroll-area">
                {messages.length === 0 ? (
                    <div className="mod-no-messages">No messages found.</div>
                ) : (
                    messages.map(msg => (
                        <div key={msg._id} className="mod-chat-card">
                            <div className="mod-chat-priority-stripe" style={{ backgroundColor: getMoodColor(msg.mood) }}></div>
                            <div className="mod-chat-content">
                                <div className="mod-chat-top-row">
                                    <span className="mod-chat-name">{msg.customerName}</span>
                                    <span className="mod-chat-phone">{msg.customerPhone}</span>
                                    <span className="mod-chat-time">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                </div>

                                <div className="mod-chat-msg-area">
                                    <p className="mod-chat-text-content">
                                        {msg.text || "(Empty Message)"}
                                    </p>
                                </div>

                                <div className="mod-chat-bottom-row">
                                    <span className="mod-chat-mood-tag" style={{ backgroundColor: getMoodColor(msg.mood) }}>
                                        {msg.mood}
                                    </span>
                                    {msg.mood === 'Angry' && <span className="mod-chat-urgent-badge">URGENT</span>}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
