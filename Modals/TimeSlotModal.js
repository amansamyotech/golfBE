import mongoose from "mongoose";

const slotConfigSchema = new mongoose.Schema({
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  slot_time_minutes: {
    type: Number,
    required: true,
  },
  buffer_time_minutes: {
    type: Number,
    required: true,
  },
  ground_opening_time: {
    type: String,
    required: true,
  },
  ground_closing_time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "booked"],
    default: "available",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const TimeSlotModel = mongoose.model("TimeSlot", slotConfigSchema);
export default TimeSlotModel;
