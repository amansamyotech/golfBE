import TimeSlotModel from "../Modals/TimeSlotModal.js";
import IndividualSlotModel from "../Modals/IndividualSlots.js";
import BookingModel from "../Modals/GuestBookingModal.js";
import {
  AddedsuccessMessages,
  UpdatedsuccessMessages,
  notFount,
  DeletedsuccessMessages,
  errorMessages,
  commonMessage,
} from "../Core/messages.js";
import { statusCodes } from "../Core/constant.js";
import { createResponse } from "../helper/responseHelper.js";
import moment from "moment";

const generateSlots = (data) => {
  const startDate = moment(data.start_date[0], "YYYY-MM-DD");

  const totalSlotTime =
    Number(data.slot_time_hours || 0) * 60 +
    Number(data.slot_time_minutes || 0);

  const daysToGenerate = 365;
  const slots = [];

  for (let i = 0; i < daysToGenerate; i++) {
    const day = moment(startDate).add(i, "days");
    const dayOfWeek = day.day(); // 0 = Sunday, 6 = Saturday

    // pick opening/closing based on weekday/weekend
    let openingTime, closingTime, is_weekend;

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // weekend
      openingTime = data.weekend_opening_time;  // from UI
      closingTime = data.weekend_closing_time;  // from UI
      is_weekend = true;

    } else {
      // weekday
      openingTime = data.weekday_opening_time;  // from UI
      closingTime = data.weekday_closing_time;  // from UI
      is_weekend = false;
    }

    let slotStart = moment(
      `${day.format("YYYY-MM-DD")} ${openingTime}`,
      "YYYY-MM-DD HH:mm"
    );

    const slotClosingTime = moment(
      `${day.format("YYYY-MM-DD")} ${closingTime}`,
      "YYYY-MM-DD HH:mm"
    );

    while (true) {
      const slotEnd = moment(slotStart).add(totalSlotTime, "minutes");
      if (slotEnd.isAfter(slotClosingTime)) break;

      slots.push({
        start: slotStart.format("YYYY-MM-DD HH:mm"),
        end: slotEnd.format("YYYY-MM-DD HH:mm"),
        status: data.status,
        course: data.course,
        is_weekend,
      });

      slotStart = slotEnd.add(data.buffer_time, "minutes");
    }
  }

  return slots;
};

export const createSlot = async (data) => {


  try {
    // calculate total slot time in API
    const totalSlotTime =
      Number(data.slot_time_hours || 0) * 60 +
      Number(data.slot_time_minutes || 0);

    const newSlot = new TimeSlotModel({
      start_date: data.start_date[0],
      course: data.course,
      slot_time_hours: data.slot_time_hours,
      slot_time_minutes: data.slot_time_minutes,
      total_slot_time: data.total_slot_time,
      buffer_time: data.buffer_time,
      weekday_opening_time: data.weekday_opening_time,
      weekday_closing_time: data.weekday_closing_time,
      weekend_opening_time: data.weekend_opening_time,
      weekend_closing_time: data.weekend_closing_time,
    });
    await newSlot.save();



    const slots = generateSlots({
      ...data,
      total_slot_time: data.totalSlotTime,
    });

    await IndividualSlotModel.insertMany(slots);

    return createResponse(
      statusCodes.CREATED,
      AddedsuccessMessages.SLOT,
      slots
    );
  } catch (err) {
    console.error("Error creating slot config:", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const getAllSlots = async () => {
  try {
    const slots = await TimeSlotModel.find().populate("course", "name");
    return createResponse(statusCodes.OK, commonMessage.SUCCESS, slots);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteSlot = async (slotId) => {
  try {
    const deletedSlot = await TimeSlotModel.findByIdAndDelete(slotId);

    if (!deletedSlot) {
      return createResponse(statusCodes.NOT_FOUND, notFount.SLOT);
    }

    return createResponse(
      statusCodes.OK,
      DeletedsuccessMessages.SLOT,
      deletedSlot
    );
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const getSlotsByStartAndCourse = async (startDate, endDate, courseId) => {
  try {
    // 1. Get all slots for that course
    const allSlots = await IndividualSlotModel.find({ course: courseId });

    // 2. Filter by date range manually (since start/end are strings)
    const slots = allSlots.filter(slot => {
      const slotDate = new Date(slot.start.replace(" ", "T") + ":00Z");
      return (
        slotDate >= new Date(`${startDate}T00:00:00Z`) &&
        slotDate <= new Date(`${endDate}T23:59:59Z`)
      );
    });



    // 3. Get bookings in date range
    const bookings = await BookingModel.find({
      course: courseId,
      startTime: { $lte: new Date(`${endDate}T23:59:59Z`) },
      endTime: { $gte: new Date(`${startDate}T00:00:00Z`) },
    });



    // 4. Mark slot as booked if any booking overlaps
    const finalSlots = slots.map(slot => {
      const slotStart = new Date(slot.start.replace(" ", "T") + ":00Z");
      const slotEnd = new Date(slot.end.replace(" ", "T") + ":00Z");

      const isBooked = bookings.some(b => {
        const bStart = new Date(b.selectedSlot.start.replace(" ", "T") + ":00Z");
        const bEnd = new Date(b.selectedSlot.end.replace(" ", "T") + ":00Z");
        return bStart <= slotEnd && bEnd >= slotStart;
      });

      return {
        ...slot._doc,
        // status: isBooked ? "booked" : "available",
      };
    });



    return createResponse(statusCodes.OK, commonMessage.SUCCESS, finalSlots);
  } catch (err) {
    console.error("Error fetching slots:", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateSlot = async (id, data) => {


  try {
    const existingSlotConfig = await TimeSlotModel.findById(id);


    if (!existingSlotConfig) throw new Error("Slot config not found");

    // Normalize dates so generateSlots works consistently
    const normalizedData = {
      ...data,
      start_date: Array.isArray(data.start_date) ? data.start_date : [data.start_date],
      end_date: Array.isArray(data.end_date) ? data.end_date : [data.end_date],
    };



    // Update slot configuration
    Object.assign(existingSlotConfig, {
      start_date: normalizedData.start_date[0],
      end_date: normalizedData.end_date[0],
      course: normalizedData.course,
      slot_time_hours: normalizedData.slot_time_hours,
      slot_time_minutes: normalizedData.slot_time_minutes,
      total_slot_time: normalizedData.total_slot_time,
      buffer_time: normalizedData.buffer_time,
      ground_opening_time: normalizedData.ground_opening_time,
      ground_closing_time: normalizedData.ground_closing_time,
    });
    await existingSlotConfig.save();



    // Delete old individual slots for this config/course
    await IndividualSlotModel.deleteMany({
      course: data.course,
      start: { $gte: existingSlotConfig.start_date },
      end: { $lte: existingSlotConfig.end_date },
    });

    // Generate new slots
    const slots = generateSlots(data);
    await IndividualSlotModel.insertMany(slots);

    return createResponse(statusCodes.OK, "Slot updated successfully", slots);
  } catch (err) {
    console.error("Error updating slot:", err);
    return createResponse(statusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error");
  }
};

export const getAllIndividualSlots = async () => {
  try {
    const allSlots = await IndividualSlotModel.find();
    return createResponse(statusCodes.OK, commonMessage.SUCCESS, allSlots);
  } catch (err) {
    console.error("Error fetching slot:", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
}

export const getIndividualSlotsByDate = async (date) => {
  try {
    if (!date) {
      return res
        .status(statusCodes.BAD_REQUEST)
        .json(createResponse(statusCodes.BAD_REQUEST, "Date is required"));
    }

    // Use regex to match the date portion in `start`
    const slots = await IndividualSlotModel.find({
      start: { $regex: `^${date}` } // matches start strings that begin with the given date
    });

    return createResponse(statusCodes.OK, commonMessage.SUCCESS, slots);

  } catch (err) {
    console.error("Error fetching slots:", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};










