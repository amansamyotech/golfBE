import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    image: {
      type: String,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    teeTime: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    profileType: {
      type: String,
      enum: ["regular", "vip", "junior", "senior"],
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      required: true,
      default: "INACTIVE",
    },
  },
  { timestamps: true }
);

const MemberModel = mongoose.model("Member", memberSchema);
export default MemberModel;
