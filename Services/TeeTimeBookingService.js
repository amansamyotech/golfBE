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
export const createBooking = async (data) => {
  try {
    const newBooking = new BookingModel(data);
    const saved = await newBooking.save();
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
