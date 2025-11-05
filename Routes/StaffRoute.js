import express from "express";
import {
  createStaffController,
  getAllStaffController,
  getStaffByIdController,
  updateStaffController,
  deleteStaffController,
  changeWorkingShiftStatus,
  changeAvailabilityStatus
} from "../Controllers/StaffController.js";
import fileHandler from "../middleware/FileHandler.js";

const staffRouter = express.Router();

staffRouter.post("/create", fileHandler(), createStaffController);
staffRouter.get("/get-all", getAllStaffController);
staffRouter.put("/update/:id", fileHandler(), updateStaffController);
staffRouter.get("/:id", getStaffByIdController);
staffRouter.delete("/delete/:id", deleteStaffController);
staffRouter.put("/update-workingshift-status/:id", changeWorkingShiftStatus);
staffRouter.put("/update-status/:id", changeAvailabilityStatus);

export default staffRouter;
