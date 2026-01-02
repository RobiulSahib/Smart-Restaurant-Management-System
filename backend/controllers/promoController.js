import PromoCode from '../models/PromoCode.js';

export const getAllPromos = async (req, res) => {
    try {
        const promos = await PromoCode.find().sort({ createdAt: -1 });
        res.json(promos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPromo = async (req, res) => {
    try {
        const newPromo = new PromoCode(req.body);
        const savedPromo = await newPromo.save();
        res.status(201).json(savedPromo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updatePromo = async (req, res) => {
    try {
        const updatedPromo = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPromo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deletePromo = async (req, res) => {
    try {
        await PromoCode.findByIdAndDelete(req.params.id);
        res.json({ message: 'Promo code deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const validatePromo = async (req, res) => {
    const { code, subtotal } = req.body;
    try {
        const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });

        if (!promo) {
            return res.status(404).json({ message: 'Invalid or inactive promo code' });
        }

        if (promo.expiryDate && new Date() > new Date(promo.expiryDate)) {
            return res.status(400).json({ message: 'Promo code has expired' });
        }

        if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
            return res.status(400).json({ message: 'Promo code usage limit reached' });
        }

        let discountAmount = 0;
        if (promo.discountType === 'FLAT') {
            discountAmount = promo.discountValue;
        } else {
            discountAmount = (subtotal * promo.discountValue) / 100;
        }

        res.json({
            code: promo.code,
            discountType: promo.discountType,
            discountValue: promo.discountValue,
            discountAmount: discountAmount.toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
