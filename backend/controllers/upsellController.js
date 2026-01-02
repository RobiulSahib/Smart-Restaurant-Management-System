import Dish from '../models/Dish.js';

/**
 * Gets intelligent upsell suggestions based on the current cart.
 */
export const getUpsellSuggestions = async (req, res) => {
    try {
        const { cartItems, totalAmount } = req.body;

        if (!cartItems || cartItems.length === 0) {
            // If cart is empty, suggest some popular starters or drinks
            const fallbacks = await Dish.find({
                $or: [{ category: 'Starter' }, { category: 'Drink' }]
            }).limit(4);
            return res.json({ suggestions: fallbacks });
        }

        // Fetch full dish details for items in cart to check properties
        const dishIds = cartItems.map(item => item.dishId);
        const dishesInCart = await Dish.find({ _id: { $in: dishIds } });

        let suggestionQueries = [];
        let tagsToSuggest = new Set();
        let categoriesToSuggest = new Set();

        const hasSpicy = dishesInCart.some(d => d.spiceLevel === 'Medium' || d.spiceLevel === 'High');
        const hasMain = dishesInCart.some(d => d.category === 'Main');
        const hasDessert = dishesInCart.some(d => d.category === 'Dessert');
        const hasOnlyStarters = dishesInCart.every(d => d.category === 'Starter');

        // 1. Spicy dish -> suggest cold drinks
        if (hasSpicy) {
            categoriesToSuggest.add('Drink');
        }

        // 2. Main course -> suggest starter or drink
        if (hasMain) {
            categoriesToSuggest.add('Starter');
            categoriesToSuggest.add('Drink');
        }

        // 3. Only starters -> definitely suggest a Main
        if (hasOnlyStarters) {
            categoriesToSuggest.add('Main');
        }

        // 4. Dessert -> suggest coffee/tea (filtered by moodTags or title)
        if (hasDessert) {
            suggestionQueries.push({
                category: 'Drink',
                $or: [
                    { 'title.en': /Tea|Coffee|Latte/i },
                    { moodTags: 'Comfort' }
                ]
            });
        }

        // 5. Total > $50 -> suggest premium add-ons (expensive desserts/drinks)
        if (totalAmount > 50) {
            suggestionQueries.push({
                $or: [{ category: 'Dessert' }, { category: 'Drink' }],
                price: { $gt: 10 }
            });
        }

        // Construct final query
        let finalQuery = {};
        if (categoriesToSuggest.size > 0) {
            finalQuery.category = { $in: Array.from(categoriesToSuggest) };
        }

        // Combine with categorical suggestions if any
        let combinedSuggestions = [];

        // Fetch categorical suggestions
        if (Object.keys(finalQuery).length > 0) {
            const catSuggestions = await Dish.find({
                ...finalQuery,
                _id: { $nin: dishIds } // Don't suggest what's already in cart
            }).limit(3);
            combinedSuggestions = [...catSuggestions];
        }

        // Fetch specific queries (like coffee for dessert)
        for (const query of suggestionQueries) {
            const specificSuggestions = await Dish.find({
                ...query,
                _id: { $nin: [...dishIds, ...combinedSuggestions.map(s => s._id)] }
            }).limit(2);
            combinedSuggestions = [...combinedSuggestions, ...specificSuggestions];
        }

        // Final fallback if we don't have enough suggestions
        if (combinedSuggestions.length < 3) {
            const extras = await Dish.find({
                _id: { $nin: [...dishIds, ...combinedSuggestions.map(s => s._id)] }
            })
                .sort({ popularity: -1 })
                .limit(4 - combinedSuggestions.length);
            combinedSuggestions = [...combinedSuggestions, ...extras];
        }

        // Shuffle and limit to 4
        const shuffled = combinedSuggestions.sort(() => 0.5 - Math.random());
        res.json({ suggestions: shuffled.slice(0, 4) });

    } catch (error) {
        console.error('Error fetching upsell suggestions:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
