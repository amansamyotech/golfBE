import express from "express";
import {
  createTimeSlotController,
  getAllTimeSlotsController,
  updateTimeSlotController,
  deleteTimeSlotController,
  getSlotsByStartAndCourse,
  getAllIndividualSlots,
  getIndividualSlotsByDate,
  getAllIndividualSlotsByTimeSlotId,
  getAllIndividualSlotsByCourseId
} from "../Controllers/TimeSlotController.js";

const timeSlotRouter = express.Router();

timeSlotRouter.post("/create", createTimeSlotController);
timeSlotRouter.get("/get-all", getAllTimeSlotsController);
timeSlotRouter.put("/update/:id", updateTimeSlotController);
timeSlotRouter.delete("/delete/:id", deleteTimeSlotController);
timeSlotRouter.get("/slots", getSlotsByStartAndCourse);
timeSlotRouter.get("/all-slots", getAllIndividualSlots);
timeSlotRouter.get("/by-date/:date/:courseId", getIndividualSlotsByDate);
timeSlotRouter.get("/by-timeslot/:id", getAllIndividualSlotsByTimeSlotId);
timeSlotRouter.get("/by-course/:id", getAllIndividualSlotsByCourseId);

export default timeSlotRouter;
