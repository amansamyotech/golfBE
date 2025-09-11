import * as guestBookingService from "../Services/GuestBookingService.js";
import { sendResponse } from "../helper/responseHelper.js";

export const createGuestBookingController = async (req, res) => {
  
  const {
    name,
    email,
    phone,
    course,
    groupSize,
    caddyCart,
    amount,
    paymentMode,
    acceptRules,
    acknowledgePolicy,
    startDateTime,
    endDateTime,
  } = req.body;

  const data = {
    name,
    email,
    phone,
    course,
    groupSize,
    caddyCart,
    amount,
    paymentMode,
    acceptRules,
    acknowledgePolicy,
    startDateTime,
    endDateTime,
  };

  if (req.files && req.files.govId && req.files.govId[0]) {
    data.govId = `/images/${req.files.govId[0].filename}`;
  }

  const result = await guestBookingService.createGuestBooking(data);
  return sendResponse(res, result);
};

export const getAllGuestBookingsController = async (req, res) => {
  const result = await guestBookingService.getAllGuestBookings();
  return sendResponse(res, result);
};

export const getGuestBookingByIdController = async (req, res) => {
  const { id } = req.params;
  const result = await guestBookingService.getGuestBookingById(id);
  return sendResponse(res, result);
};

export const updateGuestBookingController = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    phone,
    course,
    dateTime,
    groupSize,
    caddyCart,
    amount,
    paymentMode,
    acceptRules,
    acknowledgePolicy,
  } = req.body;

  const data = {
    name,
    email,
    phone,
    course,
    dateTime,
    groupSize,
    caddyCart,
    amount,
    paymentMode,
    acceptRules,
    acknowledgePolicy,
  };

  if (req.files && req.files.govId && req.files.govId[0]) {
    data.govId = `/images/${req.files.govId[0].filename}`;
  }
  const result = await guestBookingService.updateGuestBooking(id, data);
  return sendResponse(res, result);
};

export const deleteGuestBookingController = async (req, res) => {
  const { id } = req.params;
  const result = await guestBookingService.deleteGuestBooking(id);
  return sendResponse(res, result);
};
