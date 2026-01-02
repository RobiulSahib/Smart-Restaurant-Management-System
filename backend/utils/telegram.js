import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = botToken ? new TelegramBot(botToken, { polling: true }) : null;

// Store admin chat ID (first person to message the bot becomes admin/receiver)
export let adminChatId = '8103776111';

// Map to track MessageID -> SocketID for targeted replies
export const msgMap = new Map();

// Simple cleanup every hour to prevent memory leaks
setInterval(() => { msgMap.clear(); }, 3600000);

export const initTelegramBot = (io) => {
    if (!bot) {
        console.warn("⚠️ TELEGRAM_BOT_TOKEN missing. Chat features will not sync.");
        return null;
    }

    console.log('🤖 Telegram Bot Initializing...');

    // STARTUP PING to verify connection
    bot.getMe().then(me => {
        console.log(`✅ Bot Connected as @${me.username}`);
        bot.sendMessage(adminChatId, "🚀 **System Online!**\nConnection to Telegram is successful.", { parse_mode: 'Markdown' })
            .then(() => console.log(`✅ Startup Ping sent to ${adminChatId}`))
            .catch(e => console.error(`❌ Startup Ping FAILED: ${e.message}`));
    }).catch(e => console.error(`❌ Bot Token Invalid: ${e.message}`));

    // Listen for any kind of message to capture Chat ID
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;

        // If we haven't set an admin yet, OR if this is a command to take over
        if (!adminChatId || msg.text === '/start') {
            adminChatId = chatId;
            console.log(`✅ [Telegram] Admin Chat ID CAPTURED: ${chatId}`);
            bot.sendMessage(chatId, "✅ You are now registered as the Admin for the Restaurant Chat!");
        }

        // Handle Reply
        if (msg.reply_to_message && msg.text) {
            const originalMsgId = msg.reply_to_message.message_id;
            const targetSocketId = msgMap.get(originalMsgId);

            if (targetSocketId) {
                console.log(`[Telegram -> Web] Routing reply to socket: ${targetSocketId}`);
                io.to(targetSocketId).emit('admin_reply', msg.text);
            } else {
                console.log('[Telegram -> Web] Target socket lost or expired. Broadcasting.');
                io.emit('admin_reply', msg.text); // Fallback
            }
        } else if (msg.text) {
            // General Broadcast if not a reply
            io.emit('admin_reply', msg.text);
        }
    });

    bot.on("polling_error", console.log);
    return bot;
};

export default bot;
