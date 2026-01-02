import mongoose from 'mongoose';

const DishReviewSchema = new mongoose.Schema({
    dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
    dishName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    orderId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Compound index to prevent duplicate reviews: one review per dish per order
DishReviewSchema.index({ orderId: 1, dishId: 1 }, { unique: true });

const DishReview = mongoose.model('DishReview', DishReviewSchema);
export default DishReview;
