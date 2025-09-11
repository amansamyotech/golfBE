import express from "express";
import {
  createTimeSlotController,
  getAllTimeSlotsController,
  updateTimeSlotController,
  deleteTimeSlotController,
} from "../Controllers/TimeSlotController.js";

const timeSlotRouter = express.Router();

timeSlotRouter.post("/create", createTimeSlotController);
timeSlotRouter.get("/get-all", getAllTimeSlotsController);
timeSlotRouter.put("/update/:id", updateTimeSlotController);
timeSlotRouter.delete("/delete/:id", deleteTimeSlotController);

export default timeSlotRouter;
