import express from "express";
import fileHandler from "../middleware/FileHandler.js";
import {
  createPlanController,
  getPlansController,
  getPlanByIdController,
  updatePlanController,
  deletePlanController,
} from "../Controllers/MembershipPlanController.js";
import { verifyToken } from "../helper/Auth.js";

const planRouter = express.Router();

planRouter.use(verifyToken);

// planRouter.post("/create", fileHandler(), createPlanController);
planRouter.post("/create", createPlanController);
planRouter.get("/get-all", getPlansController);
planRouter.get("/get/:id", getPlanByIdController);
// planRouter.put("/update/:id", fileHandler(), updatePlanController);
planRouter.put("/update/:id", updatePlanController);
planRouter.delete("/delete/:id", deletePlanController);

export default planRouter;
