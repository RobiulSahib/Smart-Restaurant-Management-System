import mongoose from 'mongoose';

const DishSchema = new mongoose.Schema({
    title: {
        en: { type: String, required: true },
        bn: { type: String, required: true }
    },
    description: {
        en: { type: String },
        bn: { type: String }
    },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String, required: true },
    available: { type: Boolean, default: true },
    isVegan: { type: Boolean, default: false },
    isVegetarian: { type: Boolean, default: false },
    isHalal: { type: Boolean, default: false },
    containsNuts: { type: Boolean, default: false },
    containsDairy: { type: Boolean, default: false },
    spiceLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    options: {
        sizes: [{ type: String }],
        spice: { type: Boolean, default: false },
        addons: [{ type: String }]
    },
    isDrink: { type: Boolean, default: false },
    isDessert: { type: Boolean, default: false },
    moodTags: [{ type: String }],
    popularity: { type: Number, default: 0 }
});

const Dish = mongoose.model('Dish', DishSchema);
export default Dish;
