export const dishes = [
    // STARTERS
    {
        id: 1,
        category: "Starters",
        price: 12.00,
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
        available: true,
        title: { en: "Crispy Calamari", bn: "মুচমুচে কালামারি" },
        description: { en: "Golden fried squid rings with spicy lemon aioli.", bn: "স্পাইসি লেবু আইওলির সাথে গোল্ডেন ফ্রাইড স্কুইড রিং।" },
        options: { spice: true, sizes: ["Regular"], addons: ["Extra Sauce"] }
    },
    {
        id: 2,
        category: "Starters",
        price: 9.50,
        image: "https://images.unsplash.com/photo-1506280754576-f6fa8a873550?auto=format&fit=crop&w=800&q=80",
        available: true,
        title: { en: "Bruschetta Board", bn: "ব্রুস্কেটা বোর্ড" },
        description: { en: "Rustic bread topped with tomato, basil, and balsamic.", bn: "টমেটো, বেসিল এবং বালসামিক সহ গ্রামীণ রুটি।" },
        options: { spice: false, sizes: ["Regular"], addons: ["Cheese"] }
    },
    {
        id: 10,
        category: "Starters",
        price: 8.00,
        image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80",
        available: true,
        title: { en: "Caesar Salad", bn: "সিজার সালাদ" },
        description: { en: "Crisp romaine, parmesan, croutons, and classic dressing.", bn: "রমেইন লেটুস, পারমেজান এবং ক্লাসিক ড্রেসিং।" },
        options: { spice: false, sizes: ["Regular"], addons: ["Chicken"] }
    },

    // MAINS
    {
        id: 3,
        category: "Mains",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        available: true,
        title: { en: "Classic Cheeseburger", bn: "ক্লাসিক চিজবার্গার" },
        description: { en: "Juicy premium beef patty with cheddar and fresh veggies.", bn: "চেডার এবং তাজা সবজি সহ জুসি বিফ প্যাটি।" },
        options: { spice: false, sizes: ["Single", "Double"], addons: ["Bacon"] }
    },
    {
        id: 4,
        category: "Mains",
        price: 18.50,
        image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80",
        available: true,
        title: { en: "Spicy Seafood Pasta", bn: "স্পাইসি সিফুড পাস্তা" },
        description: { en: "Linguine with prawns, mussels, and chili marinara.", bn: "চিংড়ি, ঝিনুক এবং চিলি মারিনারা সহলিঙ্গুইনি।" },
        options: { spice: true, sizes: ["Regular"], addons: ["Parmesan"] }
    },
    {
        id: 5,
        category: "Mains",
        price: 24.00,
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
        available: true,
        title: { en: "Grilled Salmon", bn: "গ্রিল্ড স্যালমন" },
        description: { en: "Perfectly grilled salmon fillet with asparagus and lemon butter.", bn: "শতমূলী এবং লেবু মাখন সহ গ্রিল্ড স্যালমন।" },
        options: { spice: false, sizes: ["Regular"], addons: [] }
    },
    {
        id: 11,
        category: "Mains",
        price: 28.00,
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
        available: true,
        title: { en: "Premium Ribeye Steak", bn: "রিবআই স্টেক" },
        description: { en: "10oz Ribeye steak cooked to perfection with garlic herbs.", bn: "রসুন এবং হার্ব সহ রান্না করা ১০ আউন্স রিবআই স্টেক।" },
        options: { spice: false, sizes: ["Medium Rare", "Well Done"], addons: ["Mushroom Sauce"] }
    },

    // DESSERTS
    {
        id: 7,
        category: "Desserts",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80",
        available: true,
        title: { en: "Molten Lava Cake", bn: "মোল্টেন লাভা কেক" },
        description: { en: "Warm chocolate cake with a liquid core and ice cream.", bn: "তরল কেন্দ্র এবং আইসক্রিম সহ গরম চকলেট কেক।" },
        options: { spice: false, sizes: ["Regular"], addons: [] }
    },
    {
        id: 8,
        category: "Desserts",
        price: 7.50,
        image: "https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=800&q=80",
        available: true,
        title: { en: "Classic Burger", bn: "ক্লাসিক বার্গার" }, // Using burger image for cheat, fixing in next step or keeping diverse
        // Wait, fixing:
        image: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=800&q=80",
        title: { en: "Berry Cheesecake", bn: "বেরি চিজকেক" },
        description: { en: "Creamy cheesecake topped with fresh berry compote.", bn: "তাজা বেরি কম্পোট সহ ক্রিমি চিজকেক।" },
        options: { spice: false, sizes: ["Slice"], addons: [] }
    },

    // DRINKS
    {
        id: 9,
        category: "Drinks",
        price: 8.00,
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
        available: true,
        title: { en: "Signature Mojito", bn: "সিগনেচার মোহিতো" },
        description: { en: "Minty refreshing cocktail with lime and soda.", bn: "লেবু এবং সোডা সহ রিফ্রেশিং ককটেল।" },
        options: { spice: false, sizes: ["Glass"], addons: [] }
    },
    {
        id: 12,
        category: "Drinks",
        price: 5.00,
        image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=800&q=80",
        available: true,
        title: { en: "Iced Latte", bn: "আইসড লাতে" },
        description: { en: "Chilled espresso with milk and vanilla syrup.", bn: "দুধ এবং ভ্যানিলা সিরাপ সহ ঠান্ডা এস্প্রেসো।" },
        options: { spice: false, sizes: ["Regular"], addons: ["Extra Shot"] }
    }
];
