import ChatMessage from '../models/ChatMessage.js';

/**
 * Fetches all chat messages, sorted by priority and then timestamp.
 */
export const getChatHistory = async (req, res) => {
    try {
        const messages = await ChatMessage.find({})
            .sort({ priority: -1, timestamp: -1 }) // Angry first, then newest
            .limit(100);
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Marks a message as addressed or deletes it (Optional)
 */
export const clearChat = async (req, res) => {
    try {
        await ChatMessage.deleteMany({});
        res.json({ message: 'Chat history cleared' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
