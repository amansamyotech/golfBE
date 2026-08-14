import express from "express";
import {
  createStaffController,
  getAllStaffController,
  getStaffByIdController,
  getStaffByEmailController,
  updateStaffController,
  deleteStaffController,
  changeWorkingShiftStatus,
  changeAvailabilityStatus
} from "../Controllers/StaffController.js";
import fileHandler from "../middleware/FileHandler.js";
import { verifyToken, authorizeRoles, ROLES } from "../helper/Auth.js";

const staffRouter = express.Router();

staffRouter.use(verifyToken);

// Staff can read own profile by email; management can manage staff
staffRouter.get("/by-email/:email", authorizeRoles(...ROLES.OPERATIONS), getStaffByEmailController);
staffRouter.get("/get-all", authorizeRoles(...ROLES.MANAGEMENT), getAllStaffController);
staffRouter.get("/:id", authorizeRoles(...ROLES.MANAGEMENT), getStaffByIdController);
staffRouter.post("/create", authorizeRoles(...ROLES.MANAGEMENT), fileHandler(), createStaffController);
staffRouter.put("/update/:id", authorizeRoles(...ROLES.MANAGEMENT), fileHandler(), updateStaffController);
staffRouter.delete("/delete/:id", authorizeRoles(...ROLES.MANAGEMENT), deleteStaffController);
staffRouter.put("/update-workingshift-status/:id", authorizeRoles(...ROLES.MANAGEMENT), changeWorkingShiftStatus);
staffRouter.put("/update-status/:id", authorizeRoles(...ROLES.MANAGEMENT), changeAvailabilityStatus);

export default staffRouter;
