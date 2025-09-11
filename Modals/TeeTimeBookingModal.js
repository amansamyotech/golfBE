import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    groupSize: {
      type: Number,
      required: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    isCaddy: {
      type: Boolean,
      required: false,
    },
    specialInfo: {
      type: String,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      required: true,
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

const BookingModel = mongoose.model("Booking", bookingSchema);
export default BookingModel;
