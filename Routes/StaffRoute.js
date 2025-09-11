import express from "express";
import {
  createStaffController,
  getAllStaffController,
  getStaffByIdController,
  updateStaffController,
  deleteStaffController,
} from "../Controllers/StaffController.js";
import fileHandler from "../middleware/FileHandler.js";

const staffRouter = express.Router();

staffRouter.post("/create", fileHandler(), createStaffController);
staffRouter.get("/get-all", getAllStaffController);
staffRouter.put("/update/:id", fileHandler(), updateStaffController);
staffRouter.delete("/delete/:id", deleteStaffController);

export default staffRouter;
