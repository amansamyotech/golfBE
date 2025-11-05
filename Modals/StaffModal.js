import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      require: true,
    },
    profileImg: {
      type: String,
    },
    address: {
      type: String,
    },
    jobTitle: {
      type: String,
      require: true,
    },
    department: {
      type: String,
      enum: ["caddy", "management", "cleaning", "security", "reception"],
      require: true,
    },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time"],
    },
    dateOfJoining: {
      type: Date,
    },
    workShift: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
    },
    salary: {
      type: Number,
      default: 0,
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "assigned", "onleave", "inactive"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const employeeModel = mongoose.model("employee", employeeSchema);
export default employeeModel;
