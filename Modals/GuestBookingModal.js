import mongoose from "mongoose";

const guestBookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
    },
    phone: {
      type: String,
      // required: true,
    },
    govId: {
      type: String,
      // required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    dateTime: {
      type: Date,
    },
    groupSize: {
      type: Number,
      required: true,
    },
    caddyCart: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
    },
    paymentMode: {
      type: String,
      enum: ["card", "upi", "cash"],
      default: "card",
    },
    acceptRules: {
      type: Boolean,
      required: false,
    },
    acknowledgePolicy: {
      type: Boolean,
      required: false,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    specialInfo: {
      type: String,
    },
    startDateTime: {
      type: Date,
    },
    endDateTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

const BookingModel = mongoose.model("Booking", guestBookingSchema);
export default BookingModel;
