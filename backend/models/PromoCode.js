import mongoose from 'mongoose';

const PromoCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ['FLAT', 'PERCENT'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expiryDate: {
        type: Date,
        required: false
    },
    usageLimit: {
        type: Number,
        default: null // null means unlimited
    },
    usageCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('PromoCode', PromoCodeSchema);
