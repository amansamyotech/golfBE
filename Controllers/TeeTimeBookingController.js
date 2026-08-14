import * as bookingService from "../Services/TeeTimeBookingService.js";
import { sendResponse } from "../helper/responseHelper.js";

export const createBookingController = async (req, res) => {
  if (req.files && req.files.govId && req.files.govId[0]) {
    req.body.govId = `/images/${req.files.govId[0].filename}`;
  }
  const result = await bookingService.createBooking(req.body);
  return sendResponse(res, result);
};

export const getAllBookingController = async (req, res) => {
  const result = await bookingService.getAllBookings();
  return sendResponse(res, result);
};

export const updateGuestBooking = async (req, res) => {
  if (req.files && req.files.govId && req.files.govId[0]) {
    req.body.govId = `/images/${req.files.govId[0].filename}`;
  }
  const { id } = req.params;
  const result = await bookingService.updateGuestBooking(id, req.body);
  return sendResponse(res, result);
}

export const cancelGuestBooking = async (req, res) => {
  const { id } = req.params;
  const result = await bookingService.cancelGuestBooking(id);
  return sendResponse(res, result);
};

export const assignSlotController = async (req, res) => {
  const result = await bookingService.assignSlot(req.body);
  return sendResponse(res, result);
}

export const getBookingDataById = async (req, res) => {
  const { id } = req.params;
  const result = await bookingService.getBookingDataById(id);
  return sendResponse(res, result);
}

export const updateBookingSlotById = async (req, res) => {
  const { bookingId } = req.params;
  const { previousSlotId, newSlotId } = req.body;
  const result = await bookingService.updateBookingSlotById(bookingId, previousSlotId, newSlotId);
  return sendResponse(res, result);
}

export const cancelBookingSlotById = async (req, res) => {
  const { bookingId } = req.params;
  const { slotId } = req.body;
  const result = await bookingService.cancelBookingSlotById(bookingId, slotId);
  return sendResponse(res, result);
}

export const cancelBookingOfGuest = async (req, res) => {
  const { bookingId } = req.params;
  const { slotId } = req.body;
  const result = await bookingService.cancelBookingOfGuest(bookingId, slotId);
  return sendResponse(res, result);
}

export const assignCaddyToBooking = async (req, res) => {
  const  id  = req.params.id;
  const { caddyId } = req.body;
  const result = await bookingService.assignCaddyToBooking(id, caddyId);
  return sendResponse(res, result);
}

