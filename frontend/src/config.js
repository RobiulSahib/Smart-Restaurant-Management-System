export const API_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === 'production' ? 'https://smart-restaurant-management-system-yngd.onrender.com' : 'http://localhost:5000');
