import Customer from '../models/Customer.js';

export const getCustomerByPhone = async (req, res) => {
    try {
        const { phone } = req.query;
        if (!phone) return res.status(400).json({ error: 'Phone required' });

        const customer = await Customer.findOne({ phone }).populate('favoriteDishes');
        if (!customer) return res.json({ found: false });

        res.json({ found: true, customer });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const toggleFavorite = async (req, res) => {
    try {
        const { phone, dishId } = req.body;
        if (!phone || !dishId) return res.status(400).json({ error: 'Phone and dishId required' });

        const customer = await Customer.findOne({ phone });
        if (!customer) return res.status(404).json({ error: 'Customer not found' });

        const dishIdStr = dishId.toString();
        const existingIndex = customer.favoriteDishes.findIndex(id => id.toString() === dishIdStr);

        if (existingIndex > -1) {
            customer.favoriteDishes.splice(existingIndex, 1);
        } else {
            customer.favoriteDishes.push(dishId);
        }

        await customer.save();
        const updated = await Customer.findOne({ phone }).populate('favoriteDishes');
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const { phone } = req.params;
        const customer = await Customer.findOne({ phone }).populate('favoriteDishes');
        if (!customer) return res.status(404).json({ error: 'Customer not found' });

        res.json(customer.favoriteDishes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createCustomer = async (req, res) => {
    try {
        const { phone, name } = req.body;
        if (!phone || !name) return res.status(400).json({ error: 'Data missing' });

        let customer = await Customer.findOne({ phone });
        if (customer) return res.status(400).json({ error: 'Customer exists' });

        customer = new Customer({
            name,
            phone,
            points: 0,
            tier: 'Silver',
            history: []
        });

        await customer.save();
        res.status(201).json(customer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateCustomerPoints = async (req, res) => {
    try {
        const { phone, totalAmount } = req.body;
        if (!phone) return res.status(400).json({ error: 'Phone required' });

        const customer = await Customer.findOne({ phone });
        if (!customer) return res.status(404).json({ error: 'Customer not found' });

        // Calculate Points
        const earned = Math.floor(totalAmount / 50);
        customer.points += earned;

        // Update Tier
        if (customer.points >= 600) customer.tier = 'Platinum';
        else if (customer.points >= 200) customer.tier = 'Gold';
        else customer.tier = 'Silver';

        // Update History
        customer.history.unshift({
            date: new Date(),
            amount: totalAmount,
            earnedPoints: earned
        });

        await customer.save();
        const updated = await Customer.findOne({ phone }).populate('favoriteDishes');
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
