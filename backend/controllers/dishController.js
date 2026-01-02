import Dish from '../models/Dish.js';

export const getAllDishes = async (req, res) => {
    try {
        const { isVegan, isHalal, nutFree, dairyFree, spiceLevel } = req.query;
        let query = {};

        if (isVegan === 'true') query.isVegan = true;
        if (isHalal === 'true') query.isHalal = true;
        if (nutFree === 'true') query.containsNuts = false;
        if (dairyFree === 'true') query.containsDairy = false;
        if (spiceLevel) query.spiceLevel = spiceLevel;

        const dishes = await Dish.find(query);
        res.json(dishes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getRecommendations = async (req, res) => {
    try {
        const { mood } = req.query;
        if (!mood) return res.status(400).json({ error: "Mood is required" });

        const recommendations = await Dish.find({
            moodTags: { $in: [mood] },
            available: true
        })
            .sort({ popularity: -1 })
            .limit(5);

        res.json(recommendations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
