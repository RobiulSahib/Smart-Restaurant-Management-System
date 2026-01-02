import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.warn('⚠️ MONGODB_URI is missing in .env');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Atlas Connected');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    }
};

export default connectDB;
