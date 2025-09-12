import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


const MONGO_URI = process.env["MONGO_URI"];

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};
