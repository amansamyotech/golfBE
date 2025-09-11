import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connection successful!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
  }
};

export default connectDB;
