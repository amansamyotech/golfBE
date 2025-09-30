import express from "express";
import {
  createTimeSlotController,
  getAllTimeSlotsController,
  updateTimeSlotController,
  deleteTimeSlotController,
  getSlotsByStartAndCourse,
  getAllIndividualSlots,
  getIndividualSlotsByDate
} from "../Controllers/TimeSlotController.js";

const timeSlotRouter = express.Router();

timeSlotRouter.post("/create", createTimeSlotController);
timeSlotRouter.get("/get-all", getAllTimeSlotsController);
timeSlotRouter.put("/update/:id", updateTimeSlotController);
timeSlotRouter.delete("/delete/:id", deleteTimeSlotController);
timeSlotRouter.get("/slots", getSlotsByStartAndCourse);
timeSlotRouter.get("/all-slots", getAllIndividualSlots);
timeSlotRouter.get("/by-date/:date", getIndividualSlotsByDate);

export default timeSlotRouter;
