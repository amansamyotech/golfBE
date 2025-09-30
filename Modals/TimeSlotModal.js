import mongoose from "mongoose";

const slotConfigSchema = new mongoose.Schema(
  {
    start_date: { type: Date, required: true },
    // end_date: { type: Date, required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    slot_time_hours: { type: Number, required: true },
    slot_time_minutes: { type: Number, required: true },
    total_slot_time: { type: Number, required: true },
    buffer_time: { type: Number, required: true },
    weekday_opening_time: { type: String, required: true },
    weekday_closing_time: { type: String, required: true },
    weekend_opening_time: { type: String, required: true },
    weekend_closing_time: { type: String, required: true },
  },
  { timestamps: true }
);

const TimeSlotModel = mongoose.model("TimeSlot", slotConfigSchema);
export default TimeSlotModel;
