// Simulated MongoDB-style database
// This acts as a persistent data store for the session

const STORAGE_KEY = 'resto_app_db_v1';

// Initial Load
const loadDB = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { customers: [] };
};

const saveDB = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// In-memory cache
let dbCache = loadDB();

export const db = {
    customers: {
        find: (query) => {
            const { phoneNumber } = query;
            return dbCache.customers.find(c => c.phoneNumber === phoneNumber);
        },

        create: (data) => {
            const newCustomer = {
                ...data,
                id: Date.now().toString(),
                points: 0,
                tier: 'Silver',
                history: [],
                createdAt: new Date().toISOString()
            };
            dbCache.customers.push(newCustomer);
            saveDB(dbCache);
            return newCustomer;
        },

        update: (phoneNumber, updates) => {
            const index = dbCache.customers.findIndex(c => c.phoneNumber === phoneNumber);
            if (index === -1) return null;

            const customer = dbCache.customers[index];
            const updatedCustomer = { ...customer, ...updates };

            dbCache.customers[index] = updatedCustomer;
            saveDB(dbCache);
            return updatedCustomer;
        },

        // Specific helper for loyalty logic
        addPoints: (phoneNumber, amount, historyEntry) => {
            const index = dbCache.customers.findIndex(c => c.phoneNumber === phoneNumber);
            if (index === -1) return null;

            const customer = dbCache.customers[index];
            const newPoints = (customer.points || 0) + amount;

            // Calculate Tier
            let newTier = 'Silver';
            if (newPoints >= 600) newTier = 'Platinum';
            else if (newPoints >= 200) newTier = 'Gold';

            const updatedCustomer = {
                ...customer,
                points: newPoints,
                tier: newTier,
                history: [historyEntry, ...customer.history]
            };

            dbCache.customers[index] = updatedCustomer;
            saveDB(dbCache);
            return updatedCustomer;
        }
    }
};
