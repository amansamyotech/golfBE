import mongoose from "mongoose";

const individualSlotSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  status: {
    type: String,
    enum: ["available", "booked"],
    default: "available",
  },
  is_weekend: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const IndividualSlotModel = mongoose.model(
  "IndividualSlot",
  individualSlotSchema
);
export default IndividualSlotModel;
