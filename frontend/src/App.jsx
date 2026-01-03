// Build v2 - Force Vercel Rebuild 2026-01-03
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import './styles/animations.css';
import DishCard from './components/DishCard';
import DishModal from './components/DishModal';
import CartIcon from './components/CartIcon';
import Checkout from './components/Checkout';
import PaymentModal from './components/PaymentModal';
import OrderSuccess from './components/OrderSuccess';
import QRLanding from './components/QRLanding';
import TableControls from './components/TableControls';
import ReservationPage from './components/ReservationPage';
import CustomerAuthModal from './components/CustomerAuthModal';
import LoyaltyPage from './components/LoyaltyPage';
import KitchenDashboard from './components/KitchenDashboard';
import OrderStatus from './components/OrderStatus';
import AdminAnalytics from './components/AdminAnalytics';
import WaiterPanel from './components/WaiterPanel';
import MenuFilters from './components/MenuFilters';
import MoodSelector from './components/MoodSelector';
import { useLanguage } from './context/LanguageContext';
import { CustomerProvider, useCustomer } from './context/CustomerContext';
import { useStaff, StaffProvider } from './context/StaffContext';
import DebugConsole from './components/DebugConsole';
import ChatWidget from './components/ChatWidget';
import './App.css';
import io from 'socket.io-client';
import { API_URL } from './config';

const socket = io(API_URL);

function AppContent() {
    // ... existing state ...
    const [dishes, setDishes] = useState([]);
    const [selectedDish, setSelectedDish] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [view, setView] = useState('menu');
    const [orderId, setOrderId] = useState(null);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [activeOrder, setActiveOrder] = useState(null);

    // Filter State
    const [filters, setFilters] = useState({
        isVegan: false,
        isHalal: false,
        nutFree: false,
        dairyFree: false,
        spiceLevel: ''
    });

    const [loading, setLoading] = useState(true);
    const [selectedMood, setSelectedMood] = useState(null);
    const [recommendedDishes, setRecommendedDishes] = useState([]);

    // Fetch Dishes from Backend
    React.useEffect(() => {
        const fetchDishes = async () => {
            try {
                const params = new URLSearchParams();
                if (filters.isVegan) params.append('isVegan', 'true');
                if (filters.isHalal) params.append('isHalal', 'true');
                if (filters.nutFree) params.append('nutFree', 'true');
                if (filters.dairyFree) params.append('dairyFree', 'true');
                if (filters.spiceLevel) params.append('spiceLevel', filters.spiceLevel);

                const response = await fetch(`${API_URL}/api/dishes?${params.toString()}`);
                const data = await response.json();
                setDishes(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch dishes:", err);
                setLoading(false);
            }
        };

        fetchDishes();
    }, [filters]);

    // Fetch Mood Recommendations
    React.useEffect(() => {
        if (!selectedMood) {
            setRecommendedDishes([]);
            return;
        }

        const fetchRecommendations = async () => {
            try {
                const response = await fetch(`${API_URL}/api/dishes/recommendations?mood=${selectedMood}`);
                const data = await response.json();
                setRecommendedDishes(data);
            } catch (err) {
                console.error("Failed to fetch mood recommendations:", err);
            }
        };

        fetchRecommendations();
    }, [selectedMood]);

    // Initial Route Check
    React.useEffect(() => {
        const path = window.location.pathname;
        if (path === '/staff') {
            setView('staff');
        } else if (path === '/kitchen') {
            setView('kitchen');
        }
    }, []);

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [tableId, setTableId] = useState(null);

    const { t } = useLanguage();
    const { requireAuth, addPoints, currentCustomer } = useCustomer();
    const { placeCustomerOrder } = useStaff(); // Legacy context, might need refactor or bypass

    // ... (categories memo) ...
    const categories = useMemo(() => {
        if (!dishes || dishes.length === 0) return [];
        return [...new Set(dishes.filter(d => d.category).map(d => d.category))];
    }, [dishes]);

    // ... (handleDishClick, handleAddToCart, handleUpdateCart) ...
    const handleDishClick = (dish) => {
        if (!dish.available) return;
        setSelectedDish(dish);
        setIsModalOpen(true);
    };

    const handleAddToCart = (item) => {
        setCart(prev => [...prev, item]);
    };

    const handleUpdateCart = (newCart) => {
        setCart(newCart);
    };

    // MODIFIED PLACE ORDER LOGIC
    const handlePlaceOrder = async (amount, method) => {
        // DINE-IN FLOW (Table ID exists)
        if (tableId) {
            // Skip Payment Modal for now
            console.log("Placing Dine-In Order...");

            const newOrder = {
                tableId,
                items: cart,
                totalAmount: amount, // Calculated in Checkout
                status: 'PENDING',
                orderType: 'DINE_IN'
            };

            // Emit via Socket (using raw socket or context helper?)
            // Ideally we use a socket instance here. 
            // For now, I'll assume useStaff OR create a temp socket emit here logic
            // But cleaner is to use the context. 
            // Since useStaff has 'placeCustomerOrder', let's check if it supports the new format.
            // If not, we'll do a direct fetch/socket emit here for simplicity or update Context.

            // Direct Socket Emit for speed
            return new Promise((resolve) => {
                socket.emit('place_order', {
                    tableId,
                    orders: cart,
                    customerName: currentCustomer?.name || 'Guest',
                    orderType: 'DINE_IN'
                });

                socket.once('order:created', (createdOrder) => {
                    setActiveOrder(createdOrder);
                    setCart([]);
                    setView('order-status');
                    resolve(createdOrder);
                });
            });
        }

        // ONLINE FLOW
        if (method === 'cod') {
            return finalizeOrder();
        } else {
            setSelectedPaymentMethod(method);
            setPaymentModalOpen(true);
        }
    };

    // ... (finalizeOrder, handleViewChange, goHome, handleQRScan...) ...
    const finalizeOrder = async () => {
        // Prepare ID for legacy tracking (though we use DB ID now)
        const newOrderId = Math.floor(100000 + Math.random() * 900000);
        setOrderId(newOrderId);

        // Define total amount
        const total = cart.reduce((acc, item) => acc + parseFloat(item.totalPrice || item.price), 0);

        // AWARD POINTS
        addPoints(total, `Order #${newOrderId}`);

        // PLACE ORDER (Universal System)
        return new Promise((resolve) => {
            socket.emit('place_order', {
                tableId: tableId || null,
                orders: cart,
                customerName: currentCustomer?.name || 'Guest',
                orderType: tableId ? 'DINE_IN' : 'ONLINE'
            });

            socket.once('order:created', (createdOrder) => {
                setActiveOrder(createdOrder);
                setCart([]);
                setPaymentModalOpen(false);
                setView('success');
                resolve(createdOrder);
            });
        });
    };

    const handleViewChange = (newView) => {
        console.log('[Nav] Switching to:', newView);
        if (['reservation', 'qr', 'loyalty'].includes(newView)) {
            requireAuth(() => setView(newView));
        } else if (newView === 'checkout') {
            // Strict check: Must have auth to enter checkout
            requireAuth(() => setView('checkout'));
        } else {
            setView(newView);
        }
    };

    const goHome = () => setView('menu');

    const handleQRScan = (id) => {
        setTableId(id);
        setView('menu');
    };

    const handleRequestWaiter = (id) => {
        alert(`${t.qr.waiterRequested} ${id}!`);
    };

    const handleToggleStock = () => {
        setDishes(prevDishes => prevDishes.map(dish => ({
            ...dish,
            available: Math.random() > 0.3
        })));
    };

    const cartSubtotal = cart.reduce((acc, item) => acc + parseFloat(item.totalPrice || item.price), 0);
    const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

    // Global Order Status Listener
    React.useEffect(() => {
        if (tableId || activeOrder?._id) {
            if (tableId) socket.emit('join_table', tableId);
            if (activeOrder?._id) socket.emit('join_order', activeOrder._id);

            const handleStatusUpdate = (updated) => {
                console.log("[Global] Order Update:", updated.status);
                setActiveOrder(prev => {
                    if (prev && updated._id === prev._id) return updated;
                    return prev;
                });
            };

            // Don't clear activeOrder here - let OrderStatus show rating UI first
            // OrderStatus will redirect user back to menu after rating is complete

            socket.on('order:status_update', handleStatusUpdate);

            return () => {
                socket.off('order:status_update', handleStatusUpdate);
            };
        }
    }, [tableId, activeOrder?._id]);


    return (
        <div className="app">
            <CustomerAuthModal />
            <DebugConsole currentView={view} />

            {/* Header Logic */}
            {view !== 'success' && view !== 'qr' && view !== 'staff' && view !== 'kitchen' && view !== 'order-status' && (
                <Header
                    onQRClick={() => handleViewChange('qr')}
                    onReservationClick={() => handleViewChange('reservation')}
                    onLoyaltyClick={() => handleViewChange('loyalty')}
                    onStaffClick={() => setView('staff')}
                    onHomeClick={goHome}
                />
            )}

            {/* Show Chat Widget unless in Staff/Kitchen/Admin Mode */}
            {view !== 'staff' && view !== 'kitchen' && view !== 'analytics' && <ChatWidget />}

            <main className="main-content">
                {view === 'kitchen' && (
                    <KitchenDashboard onBack={goHome} />
                )}

                {view === 'order-status' && (
                    <OrderStatus order={activeOrder} onBack={() => { setActiveOrder(null); setView('menu'); }} />
                )}

                {view === 'staff' && (
                    <WaiterPanel onBack={goHome} onAnalytics={() => setView('analytics')} />
                )}

                {view === 'analytics' && (
                    <AdminAnalytics onBack={() => setView('staff')} />
                )}
                {view === 'qr' && (
                    <>
                        <Header
                            onQRClick={() => handleViewChange('qr')}
                            onReservationClick={() => handleViewChange('reservation')}
                            onLoyaltyClick={() => handleViewChange('loyalty')}
                            onHomeClick={goHome}
                        />
                        <QRLanding onScan={handleQRScan} onBack={goHome} />
                    </>
                )}

                {view === 'menu' && (
                    <div className="menu-view">
                        <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />
                        <MenuFilters filters={filters} onFilterChange={setFilters} />

                        {/* Show Table ID Banner if active */}
                        {tableId && (
                            <div style={{ background: '#e0f2fe', padding: '10px', textAlign: 'center', color: '#0369a1', fontWeight: 'bold', borderRadius: '8px', marginBottom: '1rem' }}>
                                🍽️ Dining at Table {tableId}
                            </div>
                        )}

                        <div className="menu-container">
                            <section className="menu-header">
                                <h2>{t.headers.menu}</h2>
                                <p className="menu-subtitle">{t.headers.subtitle}</p>
                            </section>

                            {/* YOUR FAVORITES SECTION */}
                            {currentCustomer?.favoriteDishes?.length > 0 && (
                                <section className="favorites-section">
                                    <div className="section-header-row">
                                        <h3 className="category-title" style={{ color: '#e11d48', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            ❤️ {t.headers.yourFavorites || 'Your Favorites'}
                                        </h3>
                                    </div>
                                    <div className="dish-grid favorites-grid">
                                        {currentCustomer.favoriteDishes
                                            .filter(d => typeof d === 'object' && d !== null && d.title) // Only show populated ones
                                            .map((dish) => (
                                                <DishCard
                                                    key={`fav-${dish._id}`}
                                                    dish={dish}
                                                    onClick={handleDishClick}
                                                    compact={true}
                                                />
                                            ))}
                                    </div>
                                    <hr className="rec-divider" style={{ borderColor: '#f43f5e', opacity: '0.2' }} />
                                </section>
                            )}

                            {selectedMood && recommendedDishes.length > 0 && (
                                <section className="recommendations-section">
                                    <div className="recommendation-badge">Chef's Recommendations for your {selectedMood} Mood</div>
                                    <div className="dish-grid recommendation-grid">
                                        {recommendedDishes.map((dish) => (
                                            <DishCard
                                                key={`rec-${dish._id}`}
                                                dish={dish}
                                                onClick={handleDishClick}
                                                compact={true}
                                            />
                                        ))}
                                    </div>
                                    <hr className="rec-divider" />
                                </section>
                            )}

                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                    <div className="menu-loading">Loading deliciousness...</div>
                                </div>
                            ) : dishes.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', background: '#f8fafc', borderRadius: '12px' }}>
                                    <h3>No dishes matched your filters</h3>
                                    <p>Try being less specific or clear all filters.</p>
                                </div>
                            ) : (
                                categories.map(category => (
                                    <section key={category} className="category-section" id={category.toLowerCase()}>
                                        <h3 className="category-title">{t.categories[category] || category}</h3>
                                        <div className="dish-grid">
                                            {dishes
                                                .filter(d => d.category === category)
                                                .map(dish => (
                                                    <DishCard
                                                        key={dish._id}
                                                        dish={dish}
                                                        onClick={handleDishClick}
                                                    />
                                                ))}
                                        </div>
                                    </section>
                                ))
                            )}
                        </div>

                        <CartIcon
                            count={cartCount}
                            subtotal={cartSubtotal}
                            onClick={() => handleViewChange('checkout')}
                        />
                    </div>
                )}

                {/* ... other views (reservation, loyalty) same as before ... */}
                {view === 'reservation' && (
                    <ReservationPage onBack={goHome} />
                )}

                {view === 'loyalty' && (
                    <LoyaltyPage onBack={goHome} />
                )}

                {view === 'checkout' && (
                    <Checkout
                        cart={cart}
                        onUpdateCart={handleUpdateCart}
                        onPlaceOrder={handlePlaceOrder} // Passes to modified handler
                        onBack={goHome}
                        isDineIn={!!tableId} // Pass prop to hide payment if needed
                    />
                )}

                {view === 'success' && (
                    <OrderSuccess
                        orderId={orderId}
                        order={activeOrder}
                        onHome={goHome}
                    />
                )}
            </main>

            <DishModal
                dish={selectedDish}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddToCart={handleAddToCart}
            />

            <PaymentModal
                isOpen={paymentModalOpen}
                method={selectedPaymentMethod}
                onConfirm={finalizeOrder}
                onClose={() => setPaymentModalOpen(false)}
            />

            {(activeOrder || (tableId && view !== 'qr' && view !== 'kitchen' && view !== 'staff' && view !== 'order-status')) && (
                <TableControls
                    tableId={tableId}
                    activeOrder={activeOrder}
                    onViewStatus={() => setView('order-status')}
                    onRequestWaiter={handleRequestWaiter}
                    onToggleStock={handleToggleStock}
                />
            )}
        </div>
    );
}

export default function App() {
    return (
        <CustomerProvider>
            <StaffProvider>
                <AppContent />
            </StaffProvider>
        </CustomerProvider>
    );
}
