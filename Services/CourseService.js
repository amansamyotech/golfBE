import CourseModel from "../Modals/CourseModal.js";
import {
  AddedFailedMessages,
  AddedsuccessMessages,
  UpdatedsuccessMessages,
  notFound,
  DeletedsuccessMessages,
  requiredMessage,
  errorMessages,
} from "../Core/messages.js";
import { statusCodes } from "../Core/constant.js";
import { createResponse } from "../helper/responseHelper.js";




// CREATE
export const createCourse = async (data) => {
  try {
    const newCourse = new CourseModel(data);
    const saved = await newCourse.save();
    return createResponse(
      statusCodes.CREATED,
      AddedsuccessMessages.COURSE,
      saved
    );
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

// GET
export const getCourses = async () => {
  try {
    const courses = await CourseModel.find();
    return createResponse(statusCodes.OK, null, courses);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

// UPDATE
export const updateCourse = async (id, updateData) => {
  try {
    const updatedCourse = await CourseModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCourse) {
      return createResponse(statusCodes.NOT_FOUND, notFound.COURSE);
    }

    return createResponse(
      statusCodes.SUCCESS,
      UpdatedsuccessMessages.COURSE,
      updatedCourse
    );
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

// DELETE
export const deleteCourse = async (id) => {
  try {
    const deletedCourse = await CourseModel.findByIdAndDelete(id);

    if (!deletedCourse) {
      return createResponse(statusCodes.NOT_FOUND, notFound.COURSE);
    }

    return createResponse(
      statusCodes.SUCCESS,
      DeletedsuccessMessages.COURSE,
      deletedCourse
    );
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};
