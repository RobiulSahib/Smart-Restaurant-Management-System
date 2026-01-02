import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 },
    tier: { type: String, default: 'Silver' },
    history: [{
        date: Date,
        amount: Number,
        earnedPoints: Number
    }],
    favoriteDishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }]
});

const Customer = mongoose.model('Customer', CustomerSchema);
export default Customer;
