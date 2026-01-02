import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    tableId: { type: Number }, // Null for Online Orders
    customerName: { type: String, default: 'Guest' },
    items: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
        name: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: Number,
    orderType: { type: String, enum: ['DINE_IN', 'ONLINE'], required: true },
    status: {
        type: String,
        enum: ['PENDING', 'COOKING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    },
    paymentStatus: {
        type: String,
        enum: ['UNPAID', 'PAID'],
        default: 'UNPAID'
    },
    paymentMethod: { type: String },
    servedBy: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;
