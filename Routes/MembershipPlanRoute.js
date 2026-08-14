import express from "express";
import fileHandler from "../middleware/FileHandler.js";
import {
  createPlanController,
  getPlansController,
  getPlanByIdController,
  updatePlanController,
  deletePlanController,
} from "../Controllers/MembershipPlanController.js";
import { verifyToken, authorizeRoles, ROLES } from "../helper/Auth.js";

const planRouter = express.Router();

planRouter.use(verifyToken);

planRouter.get("/get-all", authorizeRoles(...ROLES.OPERATIONS), getPlansController);
planRouter.get("/get/:id", authorizeRoles(...ROLES.OPERATIONS), getPlanByIdController);
planRouter.post("/create", authorizeRoles(...ROLES.MANAGEMENT), createPlanController);
planRouter.put("/update/:id", authorizeRoles(...ROLES.MANAGEMENT), updatePlanController);
planRouter.delete("/delete/:id", authorizeRoles(...ROLES.MANAGEMENT), deletePlanController);

export default planRouter;
