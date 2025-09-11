import express from "express";
import { createBookingController } from "../Controllers/TeeTimeBookingController.js";

const bookingRouter = express.Router();
bookingRouter.post("/create", createBookingController);

export default bookingRouter;
