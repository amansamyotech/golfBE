import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../Modals/User.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connection successful!");

    const { DEFAULT_FIRSTNAME, DEFAULT_LASTNAME, DEFAULT_EMAIL, DEFAULT_PASSWORD, DEFAULT_PHONE, DEFAULT_ADDRESS } = process.env;
    const existingUser = await User.findOne({ email: DEFAULT_EMAIL });

    if (!existingUser) {
      await User.create({
        firstName: DEFAULT_FIRSTNAME,
        lastName: DEFAULT_LASTNAME,
        email: DEFAULT_EMAIL,
        password: DEFAULT_PASSWORD,
        phone: DEFAULT_PHONE,
        address: DEFAULT_ADDRESS,
        role: 'Admin',
      });
      console.log("Default user created!");
    } else {
      console.log("Default user already exists.");
    }
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
  }
};

export default connectDB;
