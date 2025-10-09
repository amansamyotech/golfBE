import BookingModel from "../Modals/GuestBookingModal.js";
import IndividualSlotModel from "../Modals/IndividualSlots.js";
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
import CustomerModel from "../Modals/CustomerModal.js";
import mongoose from "mongoose";

export const createBooking = async (data) => {
  try {
    let customerId = data.customerId;

    // Guest flow: Create customer if no customerId
    if (!customerId) {
      const newCustomer = new CustomerModel({
        role: data.role,
        name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        govId: data.govId,
        startDate: data.bookingDate,
      });

      const savedCustomer = await newCustomer.save();
      customerId = savedCustomer._id;
    }

    // Step 1: Create booking
    const newBooking = new BookingModel({
      customerId: customerId,
      course: data.course,
      // slotId: selectedSlot._id,
      // startTime: selectedSlot.start,
      // endTime: selectedSlot.end,
      groupSize: data.groupSize,
      caddyCart: data.caddyCart,
      acceptRules: data.acceptRules,
      acknowledgePolicy: data.acknowledgePolicy,
      specialInfo: data.specialInfo || "",
      paymentMode: data.paymentMode || "",
      amount: data.amount || 0,
    });

    const savedBooking = await newBooking.save();

    return createResponse(
      statusCodes.CREATED,
      AddedsuccessMessages.BOOKING || "Booking created successfully",
      savedBooking
    );
  } catch (err) {
    console.error("Error creating booking:", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const getAllBookings = async () => {
  try {
    const bookings = await BookingModel.find()
      .populate("customerId", "name role startDate expiryDate email phone govId")
      .populate("course", "name")
      .populate("slotIds");
    return createResponse(statusCodes.OK, commonMessage.SUCCESS, bookings);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateGuestBooking = async (id, data) => {


  try {
    const booking = await BookingModel.findById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }


    // 1️⃣ Update customer info
    const customerUpdate = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      govId: data.govId,
      startDate: data.bookingDate,
    };

    await CustomerModel.findByIdAndUpdate(booking.customerId, customerUpdate, { new: true });

    // 2️⃣ Parse selected slot
    let newSlot = {};
    if (data.selectedSlot) {
      newSlot = typeof data.selectedSlot === "string"
        ? JSON.parse(data.selectedSlot)
        : data.selectedSlot;
    }

    // 3️⃣ Update slot status if slot has changed
    if (booking.slotId.toString() !== newSlot._id) {
      // Make previous slot available
      await IndividualSlotModel.findByIdAndUpdate(booking.slotId, { status: "available" });

      // Make new slot booked
      await IndividualSlotModel.findByIdAndUpdate(newSlot._id, { status: "booked" });
    }

    // 4️⃣ Update booking info
    const bookingUpdate = {
      course: new mongoose.Types.ObjectId(data.course),
      slotId: new mongoose.Types.ObjectId(newSlot._id),
      startTime: newSlot.start,
      endTime: newSlot.end,
      groupSize: Number(data.groupSize),
      caddyCart: data.caddyCart,
      acceptRules: data.acceptRules,
      acknowledgePolicy: data.acknowledgePolicy,
      specialInfo: data.specialInfo,
      paymentMode: data.paymentMode,
      amount: Number(data.amount),
    };

    const updatedBooking = await BookingModel.findByIdAndUpdate(id, bookingUpdate, { new: true });

    return createResponse(
      statusCodes.OK,
      UpdatedsuccessMessages.GUEST || "Booking updated successfully",
      updatedBooking
    );
  } catch (err) {
    console.error("Error while updating guest booking:", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const cancelGuestBooking = async (id) => {
  try {
    const booking = await BookingModel.findById(id);

    if (!booking) {
      return { success: false, message: "Booking not found" };
    }

    await BookingModel.findByIdAndDelete(id);

    await CustomerModel.findByIdAndUpdate(
      booking.customerId,
      { status: "INACTIVE" },
      { new: true }
    );

    await IndividualSlotModel.findByIdAndUpdate(
      booking.slotId,
      { status: "available" },
      { new: true }
    );

    return createResponse(
      statusCodes.OK,
      DeletedsuccessMessages.GUEST || "Booking cancelled successfully",
    );
  } catch (err) {
    console.error("Error creating booking:", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const cancelMemberBooking = async (id) => {
  try {
    console.log("id :", id);
  } catch (err) {
    console.error("Error creating booking:", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
}

export const assignSlot = async (data) => {
  try {
    // Normalize: always work with an array
    const slots = Array.isArray(data.slot) ? data.slot : [data.slot];

    // Step 1: Validate all slots
    for (const slotItem of slots) {
      const slot = await IndividualSlotModel.findById(slotItem._id);
      if (!slot) {
        return createResponse(statusCodes.NOT_FOUND, 'Slot not found');
      }
      if (slot.status === "booked") {
        return createResponse(statusCodes.BAD_REQUEST, 'Slot is already booked');
      }
    }

    // Step 2: Mark slots as booked
    await Promise.all(
      slots.map((slotItem) =>
        IndividualSlotModel.findByIdAndUpdate(slotItem._id, {
          status: "booked",
          customerId: data.customerId._id,
        })
      )
    );

    // Step 3: Update booking with slotIds
    const slotIds = slots.map((s) => s._id);

    await BookingModel.findByIdAndUpdate(data._id, {
      slotIds: slotIds,
      bookingType: data.bookingType,
      bookingStatus: "confirmed",
    });

    // Step 4: Ensure customer is ACTIVE
    await CustomerModel.findByIdAndUpdate(data.customerId._id, { status: "ACTIVE" });

    return createResponse(statusCodes.CREATED, "Slot(s) assigned successfully");
  } catch (err) {
    console.error("Error assigning slot:", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const getBookingDataById = async (id) => {
  try {
    const booking = await BookingModel.findById(id)
      .populate("course", "name")
      .populate("customerId", "name email phone status")
      .populate("slotIds");
    if (!booking) {
      return createResponse(statusCodes.NOT_FOUND, notFount.BOOKING);
    }
    return createResponse(statusCodes.OK, commonMessage.SUCCESS, booking);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateBookingSlotById = async (bookingId, previousSlotId, newSlotId) => {
  try {
    if (!previousSlotId || !newSlotId) {
      return createResponse(
        statusCodes.NOT_FOUND,
        notFount.SLOT || 'previousSlotId and newSlotId are required',
      );
    }

    // 1. Find booking
    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      return createResponse(
        statusCodes.NOT_FOUND,
        notFount.BOOKING || 'Booking not found',
      );
    }

    // 2. Free the previous slot
    await IndividualSlotModel.findByIdAndUpdate(previousSlotId, { status: "available" });

    // 3. Book the new slot
    const newSlot = await IndividualSlotModel.findById(newSlotId);

    if (!newSlot) {
      return createResponse(
        statusCodes.NOT_FOUND,
        notFount.SLOT || 'New slot not found',
      );
    }
    newSlot.status = "booked";
    await newSlot.save();

    // 4. Update booking (replace old with new at the same position)
    const index = booking.slotIds.findIndex(
      (id) => id.toString() === previousSlotId
    );

    if (index !== -1) {
      booking.slotIds[index] = newSlotId; // replace at same position
    } else if (!booking.slotIds.includes(newSlotId)) {
      // fallback: if old slot not found, just add new one
      booking.slotIds.push(newSlotId);
    }

    await booking.save();

    return createResponse(
      statusCodes.OK,
      UpdatedsuccessMessages.SLOT,
      booking
    );
  } catch (err) {
    console.error("Error in updateBookingSlotById:", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const cancelBookingSlotById = async (bookingId, slotId) => {
  try {
    if (!bookingId || !slotId) {
      return createResponse(
        statusCodes.REQIRED_ENTITY,
        requiredMessage.SLOT || 'BookingId and Slot Id are required',
      );
    }

    // Step 1: Update slot status to "available"
    const slot = await IndividualSlotModel.findById(slotId);
    if (!slot) {
      return createResponse(
        statusCodes.NOT_FOUND,
        notFount.SLOT,
      );
    }

    slot.status = "available";
    slot.customerId = null;
    await slot.save();

    // Step 2: Remove slotId from booking.slotIds array
    const booking = await BookingModel.findById(bookingId);
   
    if (!booking) {
      return createResponse(
        statusCodes.NOT_FOUND,
        notFount.BOOKING,
      );
    }

    booking.slotIds = booking.slotIds.filter(
      (id) => id.toString() !== slotId.toString()
    );


    // Step 3: If bookingType is "daily"
    if (booking.bookingType === "daily") {
      booking.bookingStatus = "canceled";

      // Step 3.1: Also update the related customer's status to "INACTIVE"
      if (booking.customerId) {
        await CustomerModel.findByIdAndUpdate(
          booking.customerId,
          { status: "INACTIVE" },
          { new: true }
        );
      }
    }
    await booking.save();

    return createResponse(
      statusCodes.OK,
      DeletedsuccessMessages.BOOKING,
    );
  } catch (err) {
    console.error("Error in cancelBookingSlotById:", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const cancelBookingOfGuest = async (bookingId, slotId) => {
  try {
    if (!bookingId || !slotId) {
      return createResponse(
        statusCodes.REQIRED_ENTITY,
        requiredMessage.SLOT || 'BookingId and Slot Id are required',
      );
    }

    // Step 1: Update slot status to "available"
    const slot = await IndividualSlotModel.findById(slotId);
    if (!slot) {
      return createResponse(
        statusCodes.NOT_FOUND,
        notFount.SLOT,
      );
    }

    slot.status = "available";
    slot.customerId = null;
    await slot.save();


    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      return createResponse(
        statusCodes.NOT_FOUND,
        notFount.BOOKING,
      );
    }



    // Step 2: Remove slotId from booking.slotIds and update status
    await BookingModel.findByIdAndUpdate(
      bookingId,
      {
        $pull: { slotIds: slotId },
        isDeleted: true,
        bookingStatus: "canceled"
      },
      { new: true }
    );

    // Step 3: Update customer status to INACTIVE
    await CustomerModel.findByIdAndUpdate(
      booking.customerId,
      { status: "INACTIVE" },
      { new: true }
    );

    return createResponse(
      statusCodes.OK,
      DeletedsuccessMessages.BOOKING,
    );
  } catch (err) {
    console.error("Error in  cancel booking of guest :", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};













