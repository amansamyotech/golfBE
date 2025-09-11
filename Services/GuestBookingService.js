import BookingModel from "../Modals/GuestBookingModal.js";
import {
  AddedFailedMessages,
  AddedsuccessMessages,
  UpdatedsuccessMessages,
  notFount,
  DeletedsuccessMessages,
  requiredMessage,
  errorMessages,
  commonMessage,
} from "../Core/messages.js";
import { statusCodes } from "../Core/constant.js";
import { createResponse } from "../helper/responseHelper.js";

// CREATE
export const createGuestBooking = async (data) => {
  try {
    const newGuest = new BookingModel(data);
    const saved = await newGuest.save();
    return createResponse(
      statusCodes.CREATED,
      AddedsuccessMessages.GUEST,
      saved
    );
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const getAllGuestBookings = async () => {
  try {
    const bookings = await BookingModel.find()
      .populate("course", "name")
      .populate("memberId", "name email phone");
    return createResponse(statusCodes.SUCCESS, null, bookings);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const getGuestBookingById = async (id) => {
  try {
    const booking = await BookingModel.findById(id).populate("course", "name");
    if (!booking) {
      return createResponse(statusCodes.NOT_FOUND, notFount.GUEST);
    }
    return createResponse(statusCodes.OK, commonMessage.SUCCESS, booking);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateGuestBooking = async (id, data) => {
  try {
    const updatedBooking = await BookingModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedBooking) {
      return createResponse(statusCodes.NOT_FOUND, notFount.GUEST);
    }
    return createResponse(
      statusCodes.SUCCESS,
      UpdatedsuccessMessages.GUEST,
      updatedBooking
    );
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteGuestBooking = async (id) => {
  try {
    const deleted = await BookingModel.findByIdAndDelete(id);
    if (!deleted) {
      return createResponse(statusCodes.NOT_FOUND, notFount.GUEST);
    }
    return createResponse(statusCodes.OK, DeletedsuccessMessages.GUEST);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};
