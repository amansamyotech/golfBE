import * as bookingService from "../Services/TeeTimeBookingService.js";
import { sendResponse } from "../helper/responseHelper.js";

export const createBookingController = async (req, res) => {
  

  const {
    memberId,
    startDateTime,
    endDateTime,
    course,
    groupSize,
    caddyCart,
    specialInfo,
  } = req.body;

  const data = {
    memberId,
    startDateTime,
    endDateTime,
    course,
    groupSize,
    caddyCart,
    specialInfo,
  };

  const result = await bookingService.createBooking(data);
  return sendResponse(res, result);
};
