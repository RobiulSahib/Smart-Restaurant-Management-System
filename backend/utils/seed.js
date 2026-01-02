import Dish from '../models/Dish.js';

export const seedDishes = async () => {
    try {
        const count = await Dish.countDocuments();
        console.log(`📊 Current dish count: ${count}`);
        if (count < 60) {
            console.log('🌱 Expanding and Seeding 65+ diverse dishes...');
            await Dish.deleteMany({});
            console.log('🗑️ Existing dishes cleared.');
            const initialDishes = [
                // STARTERS (15 ITEMS)
                {
                    title: { en: "Crispy Calamari", bn: "মুচমুচে কালামারি" },
                    description: { en: "Golden fried squid rings with spicy lemon aioli.", bn: "স্পাইসি লেবু আইওলির সাথে কালামারি রিং।" },
                    price: 12.0, category: "Starter", isHalal: true, containsDairy: true, spiceLevel: "Medium",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: true, addons: ["Extra Sauce"] },
                    moodTags: ["Spicy"]
                },
                {
                    title: { en: "Vegan Spring Rolls", bn: "ভেগান স্প্রিং রোলস" },
                    description: { en: "Crispy rolls filled with fresh garden vegetables.", bn: "তাজা সবজি দিয়ে তৈরি ভেগান স্প্রিং রোলস।" },
                    price: 8.5, category: "Starter", isVegan: true, isVegetarian: true, isHalal: true, spiceLevel: "Low",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: [] },
                    moodTags: ["Light"]
                },
                {
                    title: { en: "Spicy Nutty Chaat", bn: "স্পাইসি নাটি চাট" },
                    description: { en: "A bold mix of peanuts, spices, and tangy chutney.", bn: "বাদাম, মশলা এবং চাটনির একটি দারুণ স্বাদ।" },
                    price: 6.0, category: "Starter", isVegan: true, isVegetarian: true, containsNuts: true, spiceLevel: "High",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: true, addons: [] },
                    moodTags: ["Spicy"]
                },
                {
                    title: { en: "Halal Buffalo Wings", bn: "হালাল বাফেলো উইংস" },
                    description: { en: "Tender chicken wings tossed in hot buffalo sauce.", bn: "হট বাফেলো সস দিয়ে তৈরি মুরগির উইংস।" },
                    price: 11.0, category: "Starter", isHalal: true, containsDairy: false, spiceLevel: "High",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["6 Pieces", "12 Pieces"], spice: true, addons: ["Ranch DIP"] },
                    moodTags: ["Spicy"]
                },
                {
                    title: { en: "Garlic Hummus", bn: "গার্লিক হামাস" },
                    description: { en: "Creamy chickpea dip with extra virgin olive oil.", bn: "অলিভ অয়েলের সাথে ক্রিমি হামাস।" },
                    price: 7.0, category: "Starter", isVegan: true, isVegetarian: true, isHalal: true, spiceLevel: "Low",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: ["Extra Pita"] },
                    moodTags: ["Light"]
                },
                {
                    title: { en: "Cheese Garlic Bread", bn: "চিজ গার্লিক ব্রেড" },
                    description: { en: "Toasted bread with garlic butter and melted mozzarella.", bn: "গার্লিক বাটার এবং চিজ দিয়ে টোস্ট করা রুটি।" },
                    price: 6.5, category: "Starter", isVegetarian: true, isHalal: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["4 Slices", "8 Slices"], spice: false, addons: ["Extra Cheese"] },
                    moodTags: ["Comfort"]
                },
                {
                    title: { en: "Falafel Bites", bn: "ফালাফেল বাইটস" },
                    description: { en: "Deep-fried chickpea balls with tahini sauce.", bn: "ডিপ ফ্রাইড ফালাফেল বল।" },
                    price: 9.0, category: "Starter", isVegan: true, isVegetarian: true, isHalal: true, spiceLevel: "Medium",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1593001874117-c99c5edbb41c?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["6 Pieces"], spice: false, addons: [] },
                    moodTags: ["Light"]
                },
                {
                    title: { en: "Tomato Bruschetta", bn: "টমেটো ব্রুসেটা" },
                    description: { en: "Toasted baguette topped with tomatoes, garlic, and fresh basil.", bn: "টমেটো এবং তুলসী পাতা দিয়ে সাজানো টোস্ট করা রুটি।" },
                    price: 9.5, category: "Starter", isVegan: true, isVegetarian: true, isHalal: true, spiceLevel: "Low",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1572656631137-7935293eff45?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: [] },
                    moodTags: ["Light"]
                },
                {
                    title: { en: "Stuffed Mushrooms", bn: "স্টাফড মাশরুম" },
                    description: { en: "Oven-baked mushrooms with cream cheese and herb filling.", bn: "ক্রিম চিজ দিয়ে তৈরি স্টাফড মাশরুম।" },
                    price: 10.0, category: "Starter", isVegetarian: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1621841957884-1210fe19d66d?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["6 Pieces"], spice: false, addons: [] },
                    moodTags: ["Comfort"]
                },
                {
                    title: { en: "Chicken Satay", bn: "চিকেন সাতে" },
                    description: { en: "Grilled chicken skewers with peanut dipping sauce.", bn: "বাদামের সস দিয়ে গ্রিল্ড চিকেন স্কিউয়ার্স।" },
                    price: 11.5, category: "Starter", isHalal: true, containsNuts: true, spiceLevel: "Medium",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1529692236671-f1f6e9481b28?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["4 Skewers"], spice: true, addons: [] },
                    moodTags: ["Spicy"]
                },
                {
                    title: { en: "Steamed Edamame", bn: "স্টিমড এডামামে" },
                    description: { en: "Green soybeans with a sprinkle of sea salt.", bn: "লবণ দিয়ে সেদ্ধ করা এডামামে।" },
                    price: 7.5, category: "Starter", isVegan: true, isVegetarian: true, isHalal: true, spiceLevel: "Low",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1615361413105-6df74ff89681?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: ["Spicy Version"] },
                    moodTags: ["Light"]
                },
                {
                    title: { en: "Pan-Fried Gyoza", bn: "প্যান ফ্রাইড গিওজা" },
                    description: { en: "Chicken and vegetable dumplings with soy ginger sauce.", bn: "সয়া জিনজার সস দিয়ে চিকেন ডাম্পলিংস।" },
                    price: 10.5, category: "Starter", isHalal: true, spiceLevel: "Medium",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1496158661027-4231a4773da6?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["5 Pieces"], spice: false, addons: ["Extra Soya Sauce"] },
                    moodTags: ["Spicy"]
                },
                {
                    title: { en: "Vegetable Samosas", bn: "সবজি সমোসা" },
                    description: { en: "Crispy pastry filled with spiced potatoes and peas.", bn: "মশলাদার আলু এবং মটর দিয়ে তৈরি সমোসা।" },
                    price: 6.5, category: "Starter", isVegan: true, isVegetarian: true, isHalal: true, spiceLevel: "Medium",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1601050690597-df056fb04791?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["3 Pieces"], spice: true, addons: ["Chutney"] },
                    moodTags: ["Spicy"]
                },
                {
                    title: { en: "Onion Bhajis", bn: "পিঁয়াজু (আনিয়ন ভাজি)" },
                    description: { en: "Deep-fried spiced onion fritters.", bn: "মশলাদার পিঁয়াজু।" },
                    price: 5.5, category: "Starter", isVegan: true, isVegetarian: true, isHalal: true, spiceLevel: "Medium",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1596797038558-9570a27363a0?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["6 Pieces"], spice: true, addons: [] },
                    moodTags: ["Spicy"]
                },
                {
                    title: { en: "Caprese Skewers", bn: "কাপ্রেস স্কিউয়ার্স" },
                    description: { en: "Mini mozzarella, cherry tomato, and basil skewers with balsamic glaze.", bn: "মোজারেলা, টমেটো এবং তুলসী পাতার স্কিউয়ার্স।" },
                    price: 8.0, category: "Starter", isVegetarian: true, isHalal: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1505575967455-40e256f73376?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["5 Skewers"], spice: false, addons: [] },
                    moodTags: ["Light"]
                },

                // MAINS (20 ITEMS)
                {
                    title: { en: "Vegan Chickpea Curry", bn: "ভেগান ডাল কারি" },
                    description: { en: "Hearty curry made with chickpeas and blend of spices.", bn: "মশলাদার ভেগান ছোলা কারি।" },
                    price: 15.0, category: "Main", isVegan: true, isVegetarian: true, isHalal: true, spiceLevel: "Medium",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1585937421612-70a0f2d55736?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: true, addons: ["Extra Rice"] },
                    moodTags: ["Comfort"], popularity: 85
                },
                {
                    title: { en: "Halal Beef Biryani", bn: "হালাল বিফ বিরিয়ানি" },
                    description: { en: "Aromatic basmati rice with slow-cooked beef.", bn: "সুগন্ধি বাসমতী চালে রান্না করা বিফ বিরিয়ানি।" },
                    price: 18.0, category: "Main", isHalal: true, containsDairy: true, spiceLevel: "Medium",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1563379091339-0efb17c395da?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular", "Large"], spice: true, addons: ["Raita"] },
                    moodTags: ["Spicy", "Comfort"], popularity: 98
                },
                {
                    title: { en: "Creamy Cashew Pasta", bn: "ক্রিমি কাজু বাদাম পাস্তা" },
                    description: { en: "Pasta in a rich cashew-based nut sauce.", bn: "কাজু বাদামের সস দিয়ে তৈরি পাস্তা।" },
                    price: 16.5, category: "Main", isVegan: true, containsNuts: true, containsDairy: false, spiceLevel: "Low",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: true, addons: [] },
                    moodTags: ["Comfort"], popularity: 76
                },
                {
                    title: { en: "Paneer Tikka Masala", bn: "পনির টিক্কা মাসালা" },
                    description: { en: "Grilled paneer cubes in a creamy tomato sauce.", bn: "ক্রিমি টমেটো সসে গ্রিল্ড পনির টিক্কা।" },
                    price: 17.0, category: "Main", isVegetarian: true, isHalal: true, containsDairy: true, spiceLevel: "Medium",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: true, addons: ["Garlic Naan"] },
                    moodTags: ["Comfort", "Spicy"], popularity: 92
                },
                {
                    title: { en: "Grilled Salmon", bn: "গ্রিল্ড স্যালমন" },
                    description: { en: "Flaky salmon fillet with herbs and lemon.", bn: "লেবু এবং হার্ব দিয়ে রান্না করা স্যালমন।" },
                    price: 24.0, category: "Main", isHalal: true, containsDairy: false, spiceLevel: "Low",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: ["Asparagus"] },
                    moodTags: ["Light"], popularity: 88
                },
                {
                    title: { en: "Beef Bulgogi", bn: "বিফ বুলগোগি" },
                    description: { en: "Thinly sliced marinated beef in Korean style.", bn: "কোরিয়ান স্টাইলে রান্না করা পাতলা বিফ স্লাইস।" },
                    price: 22.0, category: "Main", isHalal: true, containsNuts: false, spiceLevel: "Medium",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: true, addons: ["Kimchi"] },
                    moodTags: ["Comfort", "Spicy"], popularity: 84
                },
                {
                    title: { en: "Vegan Vegetable Ratatouille", bn: "ভেগান রাতাটুই" },
                    description: { en: "Stewed vegetables in rich tomato sauce.", bn: "টমেটো সসে রান্না করা বিভিন্ন ধরনের সবজি।" },
                    price: 14.5, category: "Main", isVegan: true, isVegetarian: true, isHalal: true, spiceLevel: "Low",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: [] },
                    moodTags: ["Comfort", "Light"], popularity: 72
                },
                {
                    title: { en: "Spicy Halal Lamb Chops", bn: "স্পাইসি ল্যাম্ব চপস" },
                    description: { en: "Tender lamb chops with a spicy herb crust.", bn: "স্পাইসি হার্ব ক্রাস্ট দিয়ে রান্না করা ল্যাম্ব চপস।" },
                    price: 26.0, category: "Main", isHalal: true, containsDairy: false, spiceLevel: "High",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1623961988350-df49d979685e?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["3 Pieces", "5 Pieces"], spice: true, addons: ["Mint Jelly"] },
                    moodTags: ["Spicy"], popularity: 95
                },
                {
                    title: { en: "Nutty Thai Green Curry", bn: "নাটি থাই গ্রিন কারি" },
                    description: { en: "Authentic Thai curry with crushed peanuts.", bn: "বাদাম দিয়ে তৈরি অথেন্টিক থাই গ্রিন কারি।" },
                    price: 19.0, category: "Main", isHalal: true, containsNuts: true, spiceLevel: "High",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: true, addons: ["Sticky Rice"] },
                    moodTags: ["Spicy"], popularity: 82
                },
                {
                    title: { en: "Chicken Alfredo", bn: "চিকেন আলফ্রেডো" },
                    description: { en: "Fettuccine pasta in a creamy garlic parmesan sauce.", bn: "ক্রিমি সাদা সসে চিকেন পাস্তা।" },
                    price: 18.5, category: "Main", isHalal: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: ["Extra Cheese"] },
                    moodTags: ["Comfort"], popularity: 90
                },
                {
                    title: { en: "Traditional Shepherd's Pie", bn: "শেফার্ডস পাই" },
                    description: { en: "Minced lamb with vegetables topped with mashed potatoes.", bn: "ম্যাশড পটেটো এবং ল্যাম্ব দিয়ে তৈরি পাই।" },
                    price: 20.0, category: "Main", isHalal: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1594998814419-f7d63e50d179?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: [] },
                    moodTags: ["Comfort"], popularity: 87
                },
                {
                    title: { en: "Authentic Pad Thai", bn: "অথেন্টিক প্যাড থাই" },
                    description: { en: "Stir-fried rice noodles with tofu, sprouts, and peanuts.", bn: "টোফু এবং বাদাম দিয়ে তৈরি থাই নুডলস।" },
                    price: 16.0, category: "Main", isVegetarian: true, isHalal: true, containsNuts: true, spiceLevel: "Medium",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: true, addons: ["Shrimp (Non-Veg)"] },
                    moodTags: ["Spicy"], popularity: 81
                },
                {
                    title: { en: "Margherita Pizza", bn: "মার্গারিটা পিৎজা" },
                    description: { en: "Classic pizza with tomato sauce, fresh mozzarella, and basil.", bn: "টমেটো সস এবং চিজ দিয়ে তৈরি বিখ্যাত পিৎজা।" },
                    price: 14.0, category: "Main", isVegetarian: true, isHalal: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["12 Inch", "16 Inch"], spice: false, addons: ["Extra Toppings"] },
                    moodTags: ["Comfort"], popularity: 96
                },
                {
                    title: { en: "Wild Mushroom Risotto", bn: "মাশরুম রিসোতো" },
                    description: { en: "Creamy Italian rice with assorted wild mushrooms and parmesan.", bn: "ক্রিমি ইতালিয়ান মাশরুম রাইস।" },
                    price: 19.5, category: "Main", isVegetarian: true, isHalal: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: ["Truffle Oil"] },
                    moodTags: ["Comfort"], popularity: 79
                },
                {
                    title: { en: "Steak Frites", bn: "স্টেক ফ্রাইটস" },
                    description: { en: "Grilled halal ribeye steak served with crispy fries.", bn: "হালাল রিবআই স্টেক এবং ফ্রাই।" },
                    price: 28.0, category: "Main", isHalal: true, containsDairy: false, spiceLevel: "Medium",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Medium Rare", "Medium", "Well Done"], spice: true, addons: ["Pepper Sauce"] },
                    moodTags: ["Comfort"], popularity: 94
                },
                {
                    title: { en: "Spicy Miso Ramen", bn: "স্পাইসি মিসো রামেন" },
                    description: { en: "Ramen noodles in a rich miso broth with bamboo and nori.", bn: "মশলাদার মিসো ব্রথ দিয়ে রামেন নুডলস।" },
                    price: 17.5, category: "Main", isVegetarian: true, isHalal: true, spiceLevel: "High",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: true, addons: ["Soft Boiled Egg"] },
                    moodTags: ["Spicy"], popularity: 89
                },
                {
                    title: { en: "Sushi Platter", bn: "সুশি প্ল্যাটটার" },
                    description: { en: "Assorted nigiri and maki rolls with wasabi and ginger.", bn: "বিভিন্ন ধরনের সুশি এবং রোল।" },
                    price: 32.0, category: "Main", isHalal: true, spiceLevel: "Low",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["12 Pieces", "24 Pieces"], spice: true, addons: [] },
                    moodTags: ["Light"], popularity: 91
                },
                {
                    title: { en: "Grilled Fish Tacos", bn: "গ্রিল্ড ফিশ টাকোস" },
                    description: { en: "Three soft tortillas with grilled white fish, slaw, and lime.", bn: "মাছ এবং লেবু দিয়ে তৈরি টাকোস।" },
                    price: 15.5, category: "Main", isHalal: true, containsDairy: true, spiceLevel: "Medium",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["3 Tacos"], spice: true, addons: ["Guacamole"] },
                    moodTags: ["Light"], popularity: 83
                },
                {
                    title: { en: "Vegetable Enchiladas", bn: "সবজি এনচিলাডাস" },
                    description: { en: "Tortillas rolled with beans and vegetables, baked with cheese.", bn: "সবজি এবং চিজ দিয়ে তৈরি এনচিলাডাস।" },
                    price: 16.5, category: "Main", isVegetarian: true, isHalal: true, containsDairy: true, spiceLevel: "Medium",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: true, addons: ["Sour Cream"] },
                    moodTags: ["Comfort"], popularity: 80
                },
                {
                    title: { en: "Premium Wagyu Burger", bn: "প্রিমিয়াম ওয়াগিউ বার্গার" },
                    description: { en: "Gourmet halal wagyu beef patty with truffle aioli on brioche.", bn: "প্রিমিয়াম বিফ প্যাটি দিয়ে তৈরি বার্গার।" },
                    price: 22.5, category: "Main", isHalal: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: false, isDessert: false,
                    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: ["Bacon (Halal)", "Caramelized Onions"] },
                    moodTags: ["Comfort"], popularity: 97
                },

                // DESSERTS (10 ITEMS)
                {
                    title: { en: "Vegan Coconut Panna Cotta", bn: "ভেগান কোকোনাট পানাকোটা" },
                    description: { en: "Silky panna cotta made with coconut milk.", bn: "নারকেলের দুধ দিয়ে তৈরি সিল্কি পানাকোটা।" },
                    price: 9.0, category: "Dessert", isVegan: true, containsDairy: false, spiceLevel: "Low",
                    isDrink: false, isDessert: true,
                    image: "https://images.unsplash.com/photo-1488477181946-6428a029311?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: ["Berry Jam"] },
                    moodTags: ["Sweet"], popularity: 75
                },
                {
                    title: { en: "Halal Berry Cheesecake", bn: "হালাল বেরি চিজকেক" },
                    description: { en: "Rich cheesecake topped with fresh berries.", bn: "তাজা বেরি দিয়ে তৈরি হালাল চিজকেক।" },
                    price: 10.5, category: "Dessert", isHalal: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: false, isDessert: true,
                    image: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Slice"], spice: false, addons: ["Extra Cream"] },
                    moodTags: ["Sweet"], popularity: 93
                },
                {
                    title: { en: "Almond Chocolate Torte", bn: "আমন্ড চকলেট টর্ট" },
                    description: { en: "Decadent dark chocolate torte with almonds.", bn: "কাঠবাদাম দিয়ে তৈরি ডার্ক চকলেট কেক।" },
                    price: 11.0, category: "Dessert", containsNuts: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: false, isDessert: true,
                    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: [] },
                    moodTags: ["Sweet"], popularity: 88
                },
                {
                    title: { en: "Mango Sorbet", bn: "ম্যাঙ্গো সরবেট" },
                    description: { en: "Refreshing dairy-free ice dessert.", bn: "ডেয়ারি-ফ্রি রিফ্রেশিং আইস ডিজার্ট।" },
                    price: 7.5, category: "Dessert", isVegan: true, containsDairy: false, spiceLevel: "Low",
                    isDrink: false, isDessert: true,
                    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9391?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["2 Scoops"], spice: false, addons: [] },
                    moodTags: ["Sweet", "Light"], popularity: 82
                },
                {
                    title: { en: "Baklava", bn: "বাকলাভা" },
                    description: { en: "Layered pastry with chopped nuts and honey.", bn: "বাদাম এবং মধু দিয়ে তৈরি লেয়ারড পেস্ট্রি।" },
                    price: 12.0, category: "Dessert", isHalal: true, containsNuts: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: false, isDessert: true,
                    image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["4 Pieces"], spice: false, addons: [] },
                    moodTags: ["Sweet"], popularity: 95
                },
                {
                    title: { en: "Tiramisu Classic", bn: "ইতালিয়ান টিরামিসু" },
                    description: { en: "Coffee-soaked ladyfingers with mascarpone cream.", bn: "কফি এবং মাস্কারপোন চিজ দিয়ে তৈরি ডিজার্ট।" },
                    price: 11.5, category: "Dessert", isHalal: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: false, isDessert: true,
                    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: [] },
                    moodTags: ["Sweet"], popularity: 91
                },
                {
                    title: { en: "Warm Fudge Brownie", bn: "ওয়ার্ম ফাজ ব্রাউনি" },
                    description: { en: "Gooey chocolate brownie with vanilla ice cream.", bn: "ভেনিলা আইসক্রিমের সাথে চকলেট ব্রাউনি।" },
                    price: 9.5, category: "Dessert", isVegetarian: true, isHalal: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: false, isDessert: true,
                    image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: ["Extra Ice Cream"] },
                    moodTags: ["Sweet", "Comfort"], popularity: 97
                },
                {
                    title: { en: "Seasonal Fruit Tart", bn: "ফ্রুট টার্ট" },
                    description: { en: "Pastry crust with custard and fresh seasonal fruit.", bn: "তাজা ফলের টার্ট।" },
                    price: 8.5, category: "Dessert", isVegetarian: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: false, isDessert: true,
                    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: [] },
                    moodTags: ["Sweet", "Light"], popularity: 78
                },
                {
                    title: { en: "Gulab Jamun", bn: "গুলাব জামুন" },
                    description: { en: "Fried milk-solid balls in cardamom syrup.", bn: "মিষ্টি সিরায় ডোবানো নরম গুলাব জামুন।" },
                    price: 7.0, category: "Dessert", isVegetarian: true, isHalal: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: false, isDessert: true,
                    image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["3 Pieces"], spice: false, addons: [] },
                    moodTags: ["Sweet", "Comfort"], popularity: 92
                },
                {
                    title: { en: "Cinnamon Churros", bn: "চুরোস" },
                    description: { en: "Fried dough sticks with cinnamon sugar and chocolate dip.", bn: "চকলেট ডিপের সাথে মিষ্টি চুরোস।" },
                    price: 9.0, category: "Dessert", isVegan: true, spiceLevel: "Low",
                    isDrink: false, isDessert: true,
                    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: ["Extra Chocolate"] },
                    moodTags: ["Sweet"], popularity: 86
                },

                // DRINKS (10 ITEMS)
                {
                    title: { en: "Fresh Mint Mojito", bn: "ফ্রেশ মিন্ট মোহিতো" },
                    description: { en: "Cool mint, lime, and soda.", bn: "মিন্ট, লেবু এবং সোডার ঠান্ডা পানীয়।" },
                    price: 6.0, category: "Drink", isVegan: true, spiceLevel: "Low",
                    isDrink: true, isDessert: false,
                    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Glass", "Pitcher"], spice: false, addons: ["Extra Mint"] }
                },
                {
                    title: { en: "Iced Almond Latte", bn: "আইসড আমন্ড লাতে" },
                    description: { en: "Chilled latte made with almond milk.", bn: "কাঠবাদামের দুধ দিয়ে তৈরি ঠান্ডা লাতে।" },
                    price: 7.0, category: "Drink", isVegan: true, containsNuts: true, spiceLevel: "Low",
                    isDrink: true, isDessert: false,
                    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: ["Extra Shot"] }
                },
                {
                    title: { en: "Mango Lassi", bn: "ম্যাঙ্গো লাচ্ছি" },
                    description: { en: "Traditional yogurt-based mango drink.", bn: "ঐতিহ্যবাহী দই এবং আমের পানীয়।" },
                    price: 6.5, category: "Drink", isVegetarian: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: true, isDessert: false,
                    image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Glass"], spice: false, addons: [] }
                },
                {
                    title: { en: "Spicy Virgin Mary", bn: "স্পাইসি ভার্জিন মেরি" },
                    description: { en: "Bold tomato drink with a spicy kick.", bn: "টমেটো এবং মশলা দিয়ে তৈরি সতেজ পানীয়।" },
                    price: 8.0, category: "Drink", isVegan: true, spiceLevel: "High",
                    isDrink: true, isDessert: false,
                    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Glass"], spice: true, addons: ["Celery"] },
                    moodTags: ["Spicy"], popularity: 74
                },
                {
                    title: { en: "Honey Lemon Tea", bn: "হানি লেমন টি" },
                    description: { en: "Warm and soothing tea with honey and lemon.", bn: "মধু এবং লেবু দিয়ে তৈরি আরামদায়ক চা।" },
                    price: 4.5, category: "Drink", isHalal: true, containsDairy: false, spiceLevel: "Low",
                    isDrink: true, isDessert: false,
                    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Cup"], spice: false, addons: ["Ginger"] },
                    moodTags: ["Comfort"], popularity: 89
                },
                {
                    title: { en: "Thai Iced Tea", bn: "থাই আইসড টি" },
                    description: { en: "Creamy and sweet Thai tea with spices.", bn: "ক্রিমি এবং মিষ্টি থাই চা।" },
                    price: 6.0, category: "Drink", isVegetarian: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: true, isDessert: false,
                    image: "https://images.unsplash.com/photo-1558857413-42bc37b83078?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: [] },
                    moodTags: ["Comfort", "Sweet"], popularity: 85
                },
                {
                    title: { en: "Fresh Lemonade", bn: "ফ্রেশ লেমনেড" },
                    description: { en: "Squeezed lemons with a touch of mint.", bn: "তাজা লেবুর শরবত।" },
                    price: 5.0, category: "Drink", isVegan: true, spiceLevel: "Low",
                    isDrink: true, isDessert: false,
                    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: ["Flavor Syrup"] },
                    moodTags: ["Light"], popularity: 93
                },
                {
                    title: { en: "Sparkling Water", bn: "স্পার্কলিং ওয়াটার" },
                    description: { en: "Premium carbonated water with lime.", bn: "প্রিমিয়াম স্পার্কলিং ওয়াটার।" },
                    price: 3.5, category: "Drink", isVegan: true, spiceLevel: "Low",
                    isDrink: true, isDessert: false,
                    image: "https://images.unsplash.com/photo-1552392816-3a8c5eb324a3?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Bottle"], spice: false, addons: [] },
                    moodTags: ["Light"], popularity: 76
                },
                {
                    title: { en: "Luxury Hot Chocolate", bn: "হট চকলেট" },
                    description: { en: "Rich dark chocolate with whipped cream and marshmallows.", bn: "ক্রিমি হট চকলেট পানীয়।" },
                    price: 7.5, category: "Drink", isVegetarian: true, containsDairy: true, spiceLevel: "Low",
                    isDrink: true, isDessert: false,
                    image: "https://images.unsplash.com/photo-1544787210-22bb1c7babd4?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: ["Marshmallows"] },
                    moodTags: ["Comfort", "Sweet"], popularity: 95
                },
                {
                    title: { en: "Matcha Latte", bn: "মাচা লাতে" },
                    description: { en: "Earthy green tea latte with oat milk option.", bn: "গ্রিন টি লাতে।" },
                    price: 7.0, category: "Drink", isVegan: true, containsDairy: false, spiceLevel: "Low",
                    isDrink: true, isDessert: false,
                    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=800&q=80",
                    options: { sizes: ["Regular"], spice: false, addons: ["Oat Milk"] },
                    moodTags: ["Comfort", "Light"], popularity: 84
                }
            ];
            await Dish.insertMany(initialDishes);
            console.log(`✅ Successfully seeded ${initialDishes.length} dishes!`);
        }
    } catch (error) {
        console.error('❌ Seeding Error:', error);
    }
};
