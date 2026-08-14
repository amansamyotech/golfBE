import express from "express";
import {
  createCourseController,
  getCoursesController,
  updateCourseController,
  deleteCourseController,
} from "../Controllers/CourseController.js";
import { verifyToken, authorizeRoles, ROLES } from "../helper/Auth.js";

const courseRouter = express.Router();

courseRouter.use(verifyToken);

courseRouter.get("/get-all", authorizeRoles(...ROLES.OPERATIONS), getCoursesController);
courseRouter.post("/create", authorizeRoles(...ROLES.ADMINS), createCourseController);
courseRouter.put("/update/:id", authorizeRoles(...ROLES.ADMINS), updateCourseController);
courseRouter.delete("/delete/:id", authorizeRoles(...ROLES.ADMINS), deleteCourseController);

export default courseRouter;
