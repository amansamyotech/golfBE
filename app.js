// app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Config/database.js";
import courseRouter from "./Routes/CourseRoute.js";
import planRouter from "./Routes/MembershipPlanRoute.js";
import memberRouter from "./Routes/MemberRoute.js";
import guestRouter from "./Routes/GuestBookingRoute.js";
import staffRouter from "./Routes/StaffRoute.js";
import timeSlotRouter from "./Routes/TimeSlotRoute.js";
import bookingRouter from "./Routes/TeeTimeBookingRoute.js";
import customerRouter from "./Routes/CustomerRoute.js";
import tournamentRouter from "./Routes/TournamentRoutes.js";
import playerRouter from "./Routes/PlayerRoute.js";
import productRouter from "./Routes/ProductRoute.js";
import rentalRouter from "./Routes/RentalRoute.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 4456;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve Images
app.use("/images", express.static("uploads/images"));

app.use("/api/courses", courseRouter);
app.use("/api/plan", planRouter);
app.use("/api/member", memberRouter);
app.use("/api/guest", guestRouter);
app.use("/api/staff", staffRouter);

app.use("/api/booking", bookingRouter);
app.use("/api/time-slot", timeSlotRouter);
app.use("/api/customer", customerRouter);

app.use("/api/tournament", tournamentRouter);
app.use("/api/player", playerRouter);
app.use("/api/products", productRouter); 
app.use("/api/rental", rentalRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
