import express from "express";
import {
  createGuestBookingController,
  getAllGuestBookingsController,
  getGuestBookingByIdController,
  updateGuestBookingController,
  deleteGuestBookingController,
} from "../Controllers/GuestBookingController.js";
import fileHandler from "../middleware/FileHandler.js";
import { verifyToken, authorizeRoles, ROLES } from "../helper/Auth.js";

const guestRouter = express.Router();

guestRouter.use(verifyToken);
guestRouter.use(authorizeRoles(...ROLES.OPERATIONS));

guestRouter.post("/create", fileHandler(), createGuestBookingController);
guestRouter.get("/get-all", getAllGuestBookingsController);
guestRouter.get("/:id", getGuestBookingByIdController);
guestRouter.put("/update/:id", fileHandler(), updateGuestBookingController);
guestRouter.delete("/delete/:id", deleteGuestBookingController);

export default guestRouter;
