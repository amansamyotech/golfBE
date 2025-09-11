import mongoose from "mongoose";

const individualSlotSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
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

const IndividualSlotModel = mongoose.model("IndividualSlot", individualSlotSchema);
export default IndividualSlotModel;
