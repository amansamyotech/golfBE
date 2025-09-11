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
