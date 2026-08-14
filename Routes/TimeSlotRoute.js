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
import { verifyToken, authorizeRoles, ROLES } from "../helper/Auth.js";

const timeSlotRouter = express.Router();

timeSlotRouter.use(verifyToken);

// Staff need to read slots for bookings; only management configures them
timeSlotRouter.get("/get-all", authorizeRoles(...ROLES.OPERATIONS), getAllTimeSlotsController);
timeSlotRouter.get("/slots", authorizeRoles(...ROLES.OPERATIONS), getSlotsByStartAndCourse);
timeSlotRouter.get("/all-slots", authorizeRoles(...ROLES.OPERATIONS), getAllIndividualSlots);
timeSlotRouter.get("/by-date/:date/:courseId", authorizeRoles(...ROLES.OPERATIONS), getIndividualSlotsByDate);
timeSlotRouter.get("/by-timeslot/:id", authorizeRoles(...ROLES.OPERATIONS), getAllIndividualSlotsByTimeSlotId);
timeSlotRouter.get("/by-course/:id", authorizeRoles(...ROLES.OPERATIONS), getAllIndividualSlotsByCourseId);
timeSlotRouter.post("/create", authorizeRoles(...ROLES.MANAGEMENT), createTimeSlotController);
timeSlotRouter.put("/update/:id", authorizeRoles(...ROLES.MANAGEMENT), updateTimeSlotController);
timeSlotRouter.delete("/delete/:id", authorizeRoles(...ROLES.MANAGEMENT), deleteTimeSlotController);

export default timeSlotRouter;
