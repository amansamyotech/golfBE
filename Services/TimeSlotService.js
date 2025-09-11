import TimeSlotModel from "../Modals/TimeSlotModal.js";
import IndividualSlotModel from "../Modals/IndividualSlots.js";
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
  const endDate = moment(data.end_date[0], "YYYY-MM-DD");

  const slots = [];

  // Loop through each date in the range
  for (
    let day = moment(startDate);
    day.isSameOrBefore(endDate);
    day.add(1, "days")
  ) {
    let slotStart = moment(day)
      .hour(data.ground_opening_time.hour)
      .minute(data.ground_opening_time.minute)
      .second(data.ground_opening_time.second);

    const closingTime = moment(day)
      .hour(data.ground_closing_time.hour)
      .minute(data.ground_closing_time.minute)
      .second(data.ground_closing_time.second);

    while (slotStart.add(0, "minutes").isBefore(closingTime)) {
      const slotEnd = moment(slotStart).add(data.slot_time_minutes, "minutes");

      if (slotEnd.isAfter(closingTime)) break;

      slots.push({
        start: slotStart.format("YYYY-MM-DD HH:mm"),
        end: slotEnd.format("YYYY-MM-DD HH:mm"),
        status: data.status,
      });

      // Increment start time by slot time + buffer time
      slotStart = slotEnd.add(data.buffer_time_minutes, "minutes");
    }
  }

  return slots;
};

// CREATE
export const createSlot = async (data) => {
  try {
    const newSlot = new TimeSlotModel({
      start_date: data.start_date[0],
      end_date: data.end_date[0],
      slot_time_minutes: data.slot_time_minutes,
      buffer_time_minutes: data.buffer_time_minutes,
      ground_opening_time: `${data.ground_opening_time.hour}:${data.ground_opening_time.minute}:00`,
      ground_closing_time: `${data.ground_closing_time.hour}:${data.ground_closing_time.minute}:00`,
      status: data.status,
    });

    await newSlot.save();

    const slots = generateSlots(data);

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

// GET ALL SLOTS
export const getAllSlots = async () => {
  try {
    const slots = await TimeSlotModel.find();
    return createResponse(statusCodes.OK, commonMessage.SUCCESS, slots);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

// UPDATE SLOT
export const updateSlot = async (slotId, updateData) => {
  try {
    const updatedSlot = await TimeSlotModel.findByIdAndUpdate(
      slotId,
      updateData,
      { new: true }
    );

    if (!updatedSlot) {
      return createResponse(statusCodes.NOT_FOUND, notFount.SLOT);
    }

    return createResponse(
      statusCodes.OK,
      UpdatedsuccessMessages.SLOT,
      updatedSlot
    );
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

// DELETE SLOT
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
