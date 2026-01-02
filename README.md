# 🍽️ Smart Restaurant Management System (RMS)

A professional, full-stack digital solution designed to modernize the dine-in experience through real-time technology, premium UI design, and automated staff workflows.

## 🚀 Overview
Traditional restaurants face significant inefficiencies due to manual order-taking and slow communication. **RestoFlow** (Smart RMS) digitizes the entire dining lifecycle—from QR-based menu discovery to AI-powered support and integrated POS billing.

## ✨ Key Features
1.  **QR Table Identification**: Automatically detects table numbers from QR scan URL parameters to personalize the customer dashboard.
2.  **Multilingual Visual Menu**: Instant toggle between English and Bangla for menu items, descriptions, and UI labels.
3.  **Real-Time Order Tracking**: A visual progress bar allowing customers to track orders (Pending → Preparing → Served).
4.  **Digital Service Bell**: Dedicated buttons for "Water", "Tissue", "Fork", or "Bill" that trigger instant staff alerts.
5.  **Staff Table Management Grid**: A real-time visual dashboard showing occupancy, occupied time, and active requests.
6.  **Role-Based Access (RBAC)**: Secure, PIN-protected login for Waiters, Admins, and Kitchen staff with distinct permissions.
7.  **Smart Billing POS**: Integrated checkout with subtotal calculation, adjustable discounts, and service charge management.
8.  **Recursive Bill Splitting**: Options to split the final bill by item quantity or equally among a specified number of guests.
9.  **Tip & Gratitude Tracking**: Allows customers to add tips, which are automatically logged to the serving waiter's performance metrics.
10. **Promo Code Engine**: Real-time validation and application of percentage-based or flat-rate discount coupons.
11. **AI-Powered Customer Support**: A chat widget with built-in sentiment analysis to alert staff of unsatisfied or urgent guest messages.
12. **Dietary & Spicy Filters**: Advanced menu filtering based on dietary tags (Vegan, Halal, Gluten-Free) and spice levels (Low to High).
13. **Real-Time Data Sync**: All updates are broadcasted across the customer, waiter, and admin panels using WebSocket events.
14. **Revenue & Popularity Analytics**: Admin dashboard providing real-time data on daily sales, peak hours, and top-selling dishes.
15. **Dish Rating & Feedback**: Guests can rate dishes directly from their digital receipt, feeding back into the popularity algorithm.
16. **Telegram Bot Integration**: Remote staff notifications sent to mobile devices for urgent table requests or new order alerts.

## 🛠️ Technology Stack
- **Frontend**: React.js (Vite), Vanilla CSS3 (Glassmorphism), Context API.
- **Backend**: Node.js, Express.js.
- **Real-Time**: Socket.IO for bidirectional communication.
- **Database**: MongoDB (Mongoose).
- **External**: Telegram Bot API for staff alerts.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/RobiulSahib/Smart-Restaurant-Management-System.git
cd Smart-Restaurant-Management-System
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file and add your MONGO_URI, PORT, and TELEGRAM_BOT_TOKEN
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
# Update the socket URL in config if necessary
npm run dev
```

## 🎨 Design Philosophy
The system utilizes a **Glassmorphism** design language with a focus on:
- Vibrant, harmonious color palettes.
- Smooth micro-animations for interactivity.
- Responsive, mobile-first layouts for guests.
- Clean, data-rich dashboards for staff.

---
Developed with ❤️ for modern hospitality.
