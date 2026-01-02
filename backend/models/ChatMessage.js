import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    customerName: { type: String, default: 'Guest' },
    customerPhone: { type: String, required: true },
    text: { type: String, required: true },
    mood: {
        type: String,
        enum: ['Angry', 'Neutral', 'Happy'],
        default: 'Neutral'
    },
    priority: {
        type: Number, // 1: Low (Happy), 2: Med (Neutral), 3: High (Angry)
        default: 2
    },
    color: {
        type: String,
        default: 'Yellow'
    },
    isResponse: { type: Boolean, default: false }, // true if staff, false if customer
    timestamp: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
