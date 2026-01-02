import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const StaffContext = createContext();

export const useStaff = () => useContext(StaffContext);

const INITIAL_WAITERS = [
    { id: 1, name: 'Alice', role: 'waiter', color: '#e91e63', password: 'alice123' },
    { id: 2, name: 'Bob', role: 'waiter', color: '#2196f3', password: 'bob123' },
    { id: 3, name: 'Carlos', role: 'waiter', color: '#ff9800', password: 'carlos123' },
    { id: 99, name: 'Admin', role: 'admin', color: '#333333', password: 'admin@123' }
];

const INITIAL_TABLES = [
    { id: 1, status: 'occupied', guests: 2, assignedTo: 1, orders: [{ id: 101, name: 'Burger', status: 'pending', qty: 2 }] },
    { id: 2, status: 'free', guests: 0, assignedTo: 2, orders: [] },
    { id: 3, status: 'active', guests: 4, assignedTo: 1, orders: [] },
    { id: 4, status: 'free', guests: 0, assignedTo: 3, orders: [] },
    { id: 5, status: 'free', guests: 0, assignedTo: null, orders: [] },
    { id: 6, status: 'payment', guests: 2, assignedTo: 2, orders: [] }
];

export const StaffProvider = ({ children }) => {
    const [waiters] = useState(INITIAL_WAITERS);
    const [tables, setTables] = useState(INITIAL_TABLES);
    const [currentUser, setCurrentUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        // SYNC: Listen for table updates from server
        newSocket.on('tables_update', (updatedTables) => {
            console.log('Received table update:', updatedTables);
            setTables(updatedTables);
        });

        // Get initial state
        newSocket.emit('get_tables');

        newSocket.on('staff_notification', (req) => {
            setNotifications(prev => [req, ...prev]);
        });

        newSocket.on('active_requests_list', (list) => {
            setNotifications(list);
        });

        newSocket.on('request_resolved', (id) => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        });

        // NEW: Bill Request Notification
        newSocket.on('table:bill_requested', ({ tableId }) => {
            const notif = {
                id: Date.now(),
                tableId,
                type: 'Bill Requested',
                time: new Date()
            };
            setNotifications(prev => [notif, ...prev]);
            // Also update table status locally if needed, though tables_update comes separately
        });

        newSocket.emit('get_active_requests');

        return () => newSocket.close();
    }, []);

    const login = (userId) => {
        const user = waiters.find(w => w.id === userId);
        if (user) setCurrentUser(user);
    };

    const logout = () => setCurrentUser(null);

    const assignTable = (tableId, waiterId) => {
        // Optimistic update
        setTables(prev => prev.map(t =>
            t.id === tableId ? { ...t, assignedTo: waiterId } : t
        ));
        // Sync to server
        const table = tables.find(t => t.id === tableId);
        if (table && socket) {
            const updated = { ...table, assignedTo: waiterId };
            socket.emit('update_table', updated);
        }
    };

    const updateTableStatus = (tableId, status) => {
        // Optimistic update
        setTables(prev => prev.map(t =>
            t.id === tableId ? { ...t, status } : t
        ));
        // Sync to server
        const table = tables.find(t => t.id === tableId);
        if (table && socket) {
            const updated = { ...table, status };
            socket.emit('update_table', updated);
        }
    };

    const confirmPayment = (tableId, method) => {
        if (socket) {
            socket.emit('table:confirm_payment', { tableId, method });
            // Optimistic update: free the table
            setTables(prev => prev.map(t =>
                t.id === tableId ? { ...t, status: 'free', orders: [], guests: 0 } : t
            ));
        }
    };

    const addOrder = (tableId, item) => {
        const order = {
            id: Date.now(),
            name: item.name,
            price: item.price,
            status: 'pending',
            qty: 1
        };
        // Optimistic update
        setTables(prev => prev.map(t => {
            if (t.id !== tableId) return t;
            return {
                ...t,
                status: t.status === 'free' ? 'occupied' : t.status,
                orders: [...t.orders, order]
            };
        }));
        // Sync to server
        if (socket) {
            socket.emit('place_order', { tableId, orders: [order] });
        }
    };

    const markOrderServed = (orderId) => {
        if (socket && currentUser) {
            socket.emit('order:served', {
                orderId,
                waiterName: currentUser.name
            });
            // Also update local tables state if needed for legacy compatibility
            setTables(prev => prev.map(t => ({
                ...t,
                orders: t.orders.map(o => o.id === orderId ? { ...o, status: 'served' } : o)
            })));
        }
    };

    const markItemServed = (tableId, orderId) => {
        // Optimistic update
        setTables(prev => prev.map(t => {
            if (t.id !== tableId) return t;
            return {
                ...t,
                orders: t.orders.map(o => o.id === orderId ? { ...o, status: 'served' } : o)
            };
        }));
        // Sync to server
        const table = tables.find(t => t.id === tableId);
        if (table && socket) {
            const updatedOrders = table.orders.map(o =>
                o.id === orderId ? { ...o, status: 'served' } : o
            );
            const updated = { ...table, orders: updatedOrders };
            socket.emit('update_table', updated);

            // Also update Order DB status via new event if needed, but legacy update_table updates memory.
            // Ideally we emit order:update_status too for consistency with KDS
            socket.emit('order:update_status', { orderId, status: 'SERVED' });
        }
    };

    const placeCustomerOrder = (tableId, cartItems) => {
        // Convert cart items to order format
        const newOrders = cartItems.map((item, index) => ({
            id: Date.now() + index,
            name: item.name,
            price: item.price,
            status: 'pending',
            qty: item.quantity || 1
        }));

        // Optimistic update
        setTables(prev => prev.map(t => {
            if (t.id !== tableId) return t;
            return {
                ...t,
                status: 'occupied',
                orders: [...t.orders, ...newOrders]
            };
        }));

        // Sync to server
        if (socket) {
            // Updated to match new server signature if needed, but keeping compat
            socket.emit('place_order', { tableId, orders: newOrders, orderType: 'DINE_IN' });
        } else {
            console.error("Socket not connected, order saved locally only");
        }
    };

    const resolveRequest = (requestId) => {
        if (socket) socket.emit('resolve_request', requestId);
        setNotifications(prev => prev.filter(n => n.id !== requestId));
    };

    return (
        <StaffContext.Provider value={{
            waiters,
            tables,
            currentUser,
            login,
            logout,
            assignTable,
            updateTableStatus,
            confirmPayment,
            addOrder,
            markItemServed,
            markOrderServed,
            notifications,
            resolveRequest,
            placeCustomerOrder
        }}>
            {children}
        </StaffContext.Provider>
    );
};
