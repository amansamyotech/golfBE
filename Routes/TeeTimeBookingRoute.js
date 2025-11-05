import express from "express";
import {
  createBookingController,
  getAllBookingController,
  updateGuestBooking,
  cancelGuestBooking,
  assignSlotController,
  getBookingDataById,
  updateBookingSlotById,
  cancelBookingSlotById,
  cancelBookingOfGuest,
  assignCaddyToBooking
} from "../Controllers/TeeTimeBookingController.js";
import fileHandler from "../middleware/FileHandler.js";

const bookingRouter = express.Router();
bookingRouter.post("/create", fileHandler(), createBookingController);
bookingRouter.get("/get-all", getAllBookingController);
bookingRouter.put("/update-guest/:id", fileHandler(), updateGuestBooking);
bookingRouter.delete("/cancel-guest/:id", cancelGuestBooking);
bookingRouter.post("/assign-slot/:id", assignSlotController);
bookingRouter.get("/:id", getBookingDataById);
bookingRouter.put("/update-assign-slot/:bookingId", updateBookingSlotById);
bookingRouter.put("/cancel-assign-slot/:bookingId", cancelBookingSlotById);
bookingRouter.put("/cancel-booking-guest/:bookingId", cancelBookingOfGuest);
bookingRouter.put("/assign-caddy/:id", assignCaddyToBooking);


export default bookingRouter;
