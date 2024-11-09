import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/db-task1';

export const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected Successfully');
  } catch (error) {
    console.error('Database connection failed', error);
    process.exit(1);
  }
}; 