import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

// MVC Imports
import connectDB from './config/db.js';
import { initTelegramBot, adminChatId, msgMap } from './utils/telegram.js';
import { seedDishes } from './utils/seed.js';

// Models (for Socket logic)
import Order from './models/Order.js';
import PromoCode from './models/PromoCode.js';
import ChatMessage from './models/ChatMessage.js';

// Sentiment Utility
import { detectMood } from './utils/sentiment.js';

// Routes
import customerRoutes from './routes/customerRoutes.js';
import dishRoutes from './routes/dishRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import promoRoutes from './routes/promoRoutes.js';
import upsellRoutes from './routes/upsellRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();
app.use(express.json());

// Health Check Route
app.get('/', (req, res) => {
    res.send('🚀 Smart Restaurant Management System API is Live!');
});

// Configure CORS
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://smart-restaurant-management-system-three.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean).map(origin => origin.replace(/\/$/, ""));

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Create HTTP Server & Socket.io
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

// Initialize DB, Telegram, and Seeding
const bot = initTelegramBot(io);

(async () => {
    await connectDB();
    await seedDishes();
    await seedPromos();
})();

// Seed Promo Codes
const seedPromos = async () => {
    const count = await PromoCode.countDocuments();
    if (count === 0) {
        console.log('🎟️ Seeding initial promo codes...');
        await PromoCode.insertMany([
            { code: 'WELCOME10', discountType: 'PERCENT', discountValue: 10, isActive: true },
            { code: 'FLAT50', discountType: 'FLAT', discountValue: 50, isActive: true }
        ]);
        console.log('✅ Promo codes seeded!');
    }
};

// In-memory Table State (Preserved for real-time visual grid)
let tables = [
    { id: 1, status: 'occupied', guests: 2, assignedTo: 1, orders: [{ id: 101, name: 'Burger', status: 'pending', qty: 2 }] },
    { id: 2, status: 'free', guests: 0, assignedTo: 2, orders: [] },
    { id: 3, status: 'active', guests: 4, assignedTo: 1, orders: [] },
    { id: 4, status: 'free', guests: 0, assignedTo: 3, orders: [] },
    { id: 5, status: 'free', guests: 0, assignedTo: null, orders: [] },
    { id: 6, status: 'payment', guests: 2, assignedTo: 2, orders: [] }
];

// Socket.io Logic (Keep in server.js but clean up where possible)
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_table', (tableId) => {
        if (tableId) socket.join(`table_${tableId}`);
    });

    socket.on('join_order', (orderId) => {
        if (orderId) socket.join(`order_${orderId}`);
    });

    socket.on('get_tables', () => {
        socket.emit('tables_update', tables);
    });

    socket.on('place_order', async ({ tableId, orders, customerName, orderType }) => {
        try {
            const normalizedItems = orders.map(item => ({
                id: item._id || item.id,
                name: item.name || item.title || 'Unknown Item',
                price: item.price,
                quantity: item.quantity || item.qty || 1
            }));

            const total = normalizedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

            const newOrder = new Order({
                tableId: tableId || null,
                items: normalizedItems,
                totalAmount: total,
                orderType: orderType || 'DINE_IN',
                paymentStatus: orderType === 'ONLINE' ? 'PAID' : 'UNPAID',
                customerName: customerName || 'Guest'
            });

            const savedOrder = await newOrder.save();

            if (tableId) {
                const legacyOrders = normalizedItems.map(item => ({
                    id: savedOrder._id,
                    name: item.name,
                    price: item.price,
                    status: 'pending',
                    qty: item.quantity
                }));

                tables = tables.map(t => t.id === parseInt(tableId) ? { ...t, status: 'occupied', orders: [...t.orders, ...legacyOrders] } : t);
                io.emit('tables_update', tables);
            }

            io.emit('order:new', savedOrder);
            socket.emit('order:created', savedOrder);

        } catch (e) { console.error("Order Place Error:", e); }
    });

    socket.on('order:update_status', async ({ orderId, status }) => {
        try {
            const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
            if (order) {
                if (order.tableId) {
                    tables = tables.map(t => t.id === parseInt(order.tableId) ? {
                        ...t,
                        orders: t.orders.map(o => o.id.toString() === orderId.toString() ? { ...o, status: status.toLowerCase() } : o)
                    } : t);
                    io.emit('tables_update', tables);
                    io.to(`table_${order.tableId}`).emit('order:status_update', order);
                }
                io.to(`order_${order._id}`).emit('order:status_update', order);
            }
        } catch (e) { console.error(e); }
    });

    socket.on('order:served', async ({ orderId, waiterName }) => {
        try {
            const order = await Order.findByIdAndUpdate(orderId, { status: 'SERVED', servedBy: waiterName }, { new: true });
            if (order) {
                if (order.tableId) {
                    tables = tables.map(t => t.id === parseInt(order.tableId) ? {
                        ...t,
                        orders: t.orders.map(o => o.id.toString() === orderId.toString() ? { ...o, status: 'served' } : o)
                    } : t);
                    io.emit('tables_update', tables);
                    io.to(`table_${order.tableId}`).emit('order:status_update', order);
                }
                io.to(`order_${order._id}`).emit('order:status_update', order);
            }
        } catch (e) { console.error(e); }
    });

    socket.on('table:request_bill', ({ tableId }) => {
        tables = tables.map(t => t.id === parseInt(tableId) ? { ...t, status: 'payment' } : t);
        io.emit('tables_update', tables);
        io.emit('table:bill_requested', { tableId });
    });

    socket.on('table:apply_discount', ({ tableId, orderId, promoCode, discountAmount, finalTotal }) => {
        console.log(`[Promo] Table ${tableId} applied ${promoCode}: -${discountAmount}`);
        tables = tables.map(t => t.id === parseInt(tableId) ? {
            ...t,
            appliedPromo: promoCode,
            discount: discountAmount,
            finalTotal: finalTotal
        } : t);
        io.emit('tables_update', tables);
        io.to(`table_${tableId}`).emit('table:discount_applied', { tableId, promoCode, discountAmount, finalTotal });
    });

    socket.on('table:confirm_payment', async ({ tableId, method }) => {
        // Find orders before they are cleared or updated
        const ordersToUpdate = await Order.find({ tableId: tableId, paymentStatus: 'UNPAID' });

        await Order.updateMany({ tableId: tableId, paymentStatus: 'UNPAID' }, { $set: { paymentStatus: 'PAID', status: 'COMPLETED', paymentMethod: method } });

        // Notify tracking clients that orders are now completed
        ordersToUpdate.forEach(order => {
            const updatedOrder = { ...order.toObject(), status: 'COMPLETED', paymentStatus: 'PAID' };
            io.to(`order_${order._id}`).emit('order:status_update', updatedOrder);
            io.to(`table_${tableId}`).emit('order:status_update', updatedOrder);
        });

        tables = tables.map(t => t.id === parseInt(tableId) ? { ...t, status: 'free', orders: [], guests: 0 } : t);
        io.emit('tables_update', tables);
        io.to(`table_${tableId}`).emit('table:payment_success');
    });

    socket.on('customer_message', async (data) => {
        const msgText = typeof data === 'string' ? data : data.text;
        const userInfo = typeof data === 'string' ? { name: 'Guest', phone: 'Unknown' } : data.user;

        // --- NEW: Mood Detection & Persistence ---
        const moodData = detectMood(msgText);

        try {
            const chatMsg = new ChatMessage({
                customerName: userInfo.name,
                customerPhone: userInfo.phone,
                text: msgText,
                mood: moodData.label,
                priority: moodData.score,
                color: moodData.color
            });
            await chatMsg.save();

            // Broadcast to Staff Dashboard
            io.emit('staff:new_message', chatMsg);
            console.log(`[Mood] Detected ${moodData.label} for ${userInfo.name}: "${msgText}"`);
        } catch (e) {
            console.error("[Chat] Save Error:", e);
        }
        // ----------------------------------------

        if (bot && adminChatId) {
            const emojiMap = { 'Angry': '😡', 'Happy': '😊', 'Neutral': '💬' };
            const moodEmoji = emojiMap[moodData.label] || '💬';

            const formattedMsg = `📩 *New Message* ${moodEmoji}\n👤 ${userInfo.name} (${userInfo.phone})\n💬 ${msgText}\n\n🏷️ Mood: ${moodData.label}`;
            try {
                const sentMsg = await bot.sendMessage(adminChatId, formattedMsg, { parse_mode: 'Markdown' });
                msgMap.set(sentMsg.message_id, socket.id);
            } catch (e) { console.error("❌ Telegram Send Error:", e.message); }
        } else if (!bot) {
            socket.emit('admin_reply', "Bot not configured. Echo: " + msgText);
        }
    });

    socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

// API Routes
app.use('/api/customer', customerRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/upsell', upsellRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
