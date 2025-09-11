import * as courseService from "../Services/CourseService.js";
import { sendResponse } from "../helper/responseHelper.js";

export const createCourseController = async (req, res) => {
  const result = await courseService.createCourse(req.body);
  return sendResponse(res, result);
};

export const getCoursesController = async (req, res) => {
  const result = await courseService.getCourses();
  return sendResponse(res, result);
};

export const updateCourseController = async (req, res) => {
  const { id } = req.params;
  const result = await courseService.updateCourse(id, req.body);
  return sendResponse(res, result);
};

export const deleteCourseController = async (req, res) => {
  const { id } = req.params;
  const result = await courseService.deleteCourse(id);
  return sendResponse(res, result);
};
