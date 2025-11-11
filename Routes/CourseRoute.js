import express from "express";
import {
  createCourseController,
  getCoursesController,
  updateCourseController,
  deleteCourseController,
} from "../Controllers/CourseController.js";
import { verifyToken } from "../helper/Auth.js";

const courseRouter = express.Router();

courseRouter.use(verifyToken);

courseRouter.post("/create", createCourseController);
courseRouter.get("/get-all", getCoursesController);
courseRouter.put("/update/:id", updateCourseController);
courseRouter.delete("/delete/:id", deleteCourseController);

export default courseRouter;
