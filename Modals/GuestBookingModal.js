import mongoose from "mongoose";

const guestBookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    caddyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
    },
    slotIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "IndividualSlot",
      }
    ],
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    groupSize: {
      type: Number,
    },
    caddyCart: {
      type: Boolean,
      default: false,
    },
    acceptRules: {
      type: Boolean,
    },
    acknowledgePolicy: {
      type: Boolean,
    },
    specialInfo: {
      type: String,
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "completed", "canceled"],
      default: "pending",
    },
    bookingType: {
      type: String,
      enum: ["daily", "weekly", "membership"],
      default: "daily",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const BookingModel = mongoose.model("Booking", guestBookingSchema);
export default BookingModel;
