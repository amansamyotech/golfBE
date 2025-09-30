import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["member", "guest"], required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    dob: { type: Date }, // Member only
    gender: { type: String, enum: ["male", "female", "other"] },
    govId: { type: String }, // Guest only
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "MembershipPlan" }, // Member only
    startDate: { type: Date },
    expiryDate: { type: Date },
    profileType: { type: String, enum: ["regular", "vip", "junior", "senior"] }, // Member only
    preferredTeeTime: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
    },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "INACTIVE" },
  },
  { timestamps: true }
);

const CustomerModel = mongoose.model("Customer", customerSchema);
export default CustomerModel;
