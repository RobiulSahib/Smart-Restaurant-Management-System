const TelegramBot = require('node-telegram-bot-api');

// YOUR TOKEN
const token = '8580027498:AAESHeLQcylu6oIAUCWVQFNPXc7XuJDQh0w';

console.log('🔄 Connecting to Telegram...');

const bot = new TelegramBot(token, { polling: true });

// 1. Check if Token is valid
bot.getMe().then((me) => {
    console.log(`✅ SUCCESS! Bot is online.`);
    console.log(`🤖 Name: ${me.first_name}`);
    console.log(`🔗 Username: @${me.username}`);
    console.log(`\n📢 IMPORTANT: OPEN TELEGRAM AND SEND 'HI' TO THIS BOT NOW!`);
    console.log(`   (I need to see your Chat ID to fix the main app)`);
}).catch((err) => {
    console.error('❌ ERROR: Token is invalid or blocked.');
    console.error(err.message);
    process.exit(1);
});

// 2. Listen for User Message to get ID
bot.on('message', (msg) => {
    console.log(`\n📩 MESSAGE RECEIVED!`);
    console.log(`👤 From: ${msg.from.first_name}`);
    console.log(`🆔 YOUR CHAT ID IS: ${msg.chat.id}`);
    console.log(`\n✅ COPY THIS NUMBER: ${msg.chat.id}`);
    console.log(`   (Tell me this number so I can fix your app forever!)`);
});
