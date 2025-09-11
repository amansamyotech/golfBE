import express from "express";
import fileHandler from "../middleware/FileHandler.js";
import {
  createPlanController,
  getPlansController,
  getPlanByIdController,
  updatePlanController,
  deletePlanController,
} from "../Controllers/MembershipPlanController.js";

const planRouter = express.Router();

planRouter.post("/create", fileHandler(), createPlanController);
planRouter.get("/get-all", getPlansController);
planRouter.get("/get/:id", getPlanByIdController);
planRouter.put("/update/:id", fileHandler(), updatePlanController);
planRouter.delete("/delete/:id", deletePlanController);

export default planRouter;
