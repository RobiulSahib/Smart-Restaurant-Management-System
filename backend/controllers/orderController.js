import Order from '../models/Order.js';

export const getOrders = async (req, res) => {
    try {
        const { status, kds } = req.query;
        let query = {};

        if (status) query.status = status;
        if (kds === 'true') {
            query.status = { $in: ['PENDING', 'COOKING'] };
        }

        const orders = await Order.find(query).sort({ createdAt: 1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
