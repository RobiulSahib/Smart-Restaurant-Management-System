import DishReview from '../models/DishReview.js';
import Customer from '../models/Customer.js';

export const submitReviews = async (req, res) => {
    try {
        const { orderId, reviews, customerPhone } = req.body;
        if (!orderId || !reviews || !Array.isArray(reviews)) {
            return res.status(400).json({ error: 'Missing orderId or reviews array' });
        }

        let customerId = null;
        if (customerPhone) {
            const customer = await Customer.findOne({ phone: customerPhone });
            if (customer) customerId = customer._id;
        }

        const reviewDocs = reviews.map(r => ({
            ...r,
            orderId,
            customerId
        }));

        const result = await DishReview.insertMany(reviewDocs, { ordered: false });
        res.status(201).json({ message: 'Reviews submitted', count: result.length });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'One or more items already reviewed for this order' });
        }
        res.status(500).json({ error: err.message });
    }
};

export const getReviewAnalytics = async (req, res) => {
    try {
        const stats = await DishReview.aggregate([
            {
                $group: {
                    _id: "$dishId",
                    dishName: { $first: "$dishName" },
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 },
                    comments: {
                        $push: {
                            text: "$comment",
                            rating: "$rating",
                            date: "$timestamp"
                        }
                    }
                }
            },
            { $sort: { averageRating: 1 } }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
