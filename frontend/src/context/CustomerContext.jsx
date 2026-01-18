import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../db/simulatedDB';
import { API_URL } from '../config';

const CustomerContext = createContext();

export const useCustomer = () => useContext(CustomerContext);

export const CustomerProvider = ({ children }) => {
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('customer_session');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                console.log('[Auth] Restored session for:', data.name);
                setCurrentCustomer(data);
            } catch (e) {
                console.error('[Auth] Failed to parse session', e);
            }
        }
    }, []);

    const login = async (phone, name = '') => {
        setIsLoading(true);
        console.log('[Auth] API Login:', phone);

        try {
            // 1. Search
            const searchRes = await fetch(`${API_URL}/api/customer?phone=${phone}`);
            const searchData = await searchRes.json();

            let customerData;

            if (searchData.found) {
                console.log('[Auth] Found in DB:', searchData.customer);
                customerData = searchData.customer;
            } else {
                console.log('[Auth] Creating new user...');
                const createRes = await fetch(`${API_URL}/api/customer`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone, name })
                });
                customerData = await createRes.json();
            }

            setCurrentCustomer(customerData);
            localStorage.setItem('customer_session', JSON.stringify(customerData));
            setIsAuthModalOpen(false);

            if (pendingAction) {
                pendingAction();
                setPendingAction(null);
            }
        } catch (err) {
            console.error('[Auth] API Error:', err);
            alert("Connection Error! Is the server running?");
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setCurrentCustomer(null);
        localStorage.removeItem('customer_session');
    };

    const requireAuth = (callback) => {
        if (currentCustomer) {
            callback();
        } else {
            console.log('[Auth] Requirement check failed, prompting login');
            setPendingAction(() => callback);
            setIsAuthModalOpen(true);
        }
    };

    const addPoints = async (amount, description = '') => {
        if (!currentCustomer) return;

        try {
            const res = await fetch(`${API_URL}/api/customer`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: currentCustomer.phone,
                    totalAmount: amount
                })
            });

            const updatedCustomer = await res.json();
            setCurrentCustomer(updatedCustomer);
            console.log('[Loyalty] DB Updated:', updatedCustomer);

        } catch (err) {
            console.error('[Loyalty] Update Failed:', err);
        }
    };

    const toggleFavorite = async (dishId) => {
        if (!currentCustomer) {
            requireAuth(() => toggleFavorite(dishId));
            return;
        }

        // Optimistic UI update - immediately toggle the favorite in local state
        const currentFavorites = currentCustomer.favoriteDishes || [];
        const isCurrentlyFavorited = currentFavorites.some(fav =>
            (typeof fav === 'string' && fav === dishId) ||
            (typeof fav === 'object' && fav._id === dishId)
        );

        const newFavorites = isCurrentlyFavorited
            ? currentFavorites.filter(fav =>
                (typeof fav === 'string' ? fav !== dishId : fav._id !== dishId))
            : [...currentFavorites, dishId];

        const optimisticCustomer = { ...currentCustomer, favoriteDishes: newFavorites };
        setCurrentCustomer(optimisticCustomer);
        localStorage.setItem('customer_session', JSON.stringify(optimisticCustomer));

        try {
            const res = await fetch(`${API_URL}/api/customer/favorites/toggle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: currentCustomer.phone,
                    dishId
                })
            });

            if (!res.ok) throw new Error('Failed to toggle favorite');

            const updatedCustomer = await res.json();
            setCurrentCustomer(updatedCustomer);
            localStorage.setItem('customer_session', JSON.stringify(updatedCustomer));
            console.log('[Favorites] Updated:', updatedCustomer.favoriteDishes);
        } catch (err) {
            console.error('[Favorites] Toggle Failed:', err);
            // Revert optimistic update on error
            setCurrentCustomer(currentCustomer);
            localStorage.setItem('customer_session', JSON.stringify(currentCustomer));
        }
    };

    return (
        <CustomerContext.Provider value={{
            currentCustomer,
            login,
            logout,
            requireAuth,
            addPoints,
            toggleFavorite,
            isAuthModalOpen,
            setIsAuthModalOpen
        }}>
            {children}
        </CustomerContext.Provider>
    );
};
