import * as timeSlotService from "../Services/TimeSlotService.js";
import { sendResponse } from "../helper/responseHelper.js";

export const createTimeSlotController = async (req, res) => {
  const result = await timeSlotService.createSlot(req.body);
  return sendResponse(res, result);
};

export const getAllTimeSlotsController = async (req, res) => {
  const result = await timeSlotService.getAllSlots();
  return sendResponse(res, result);
};

export const updateTimeSlotController = async (req, res) => {
  const { id } = req.params;
  const result = await timeSlotService.updateSlot(id, req.body);
  return sendResponse(res, result);
};

export const deleteTimeSlotController = async (req, res) => {
  const { id } = req.params;
  const result = await timeSlotService.deleteSlot(id);
  return sendResponse(res, result);
};

export const getSlotsByStartAndCourse = async (req, res) => {
  const { startDate, endDate, courseId } = req.query;
  const result = await timeSlotService.getSlotsByStartAndCourse(
    startDate,
    endDate,
    courseId
  );
  return sendResponse(res, result);
};

export const getAllIndividualSlots = async (req, res) => {
  const result = await timeSlotService.getAllIndividualSlots();
  return sendResponse(res, result);
}
export const getIndividualSlotsByDate = async (req, res) => {
  const { date, courseId } = req.params;
  const result = await timeSlotService.getIndividualSlotsByDate(date, courseId);
  return sendResponse(res, result);

}

export const getAllIndividualSlotsByTimeSlotId = async (req, res) => {
  const { id } = req.params;
  const result = await timeSlotService.getAllIndividualSlotsByTimeSlotId(id);
  return sendResponse(res, result);
}

export const getAllIndividualSlotsByCourseId = async (req, res) => {
  const { id } = req.params;
  const result = await timeSlotService.getAllIndividualSlotsByCourseId(id);
  return sendResponse(res, result);
}
