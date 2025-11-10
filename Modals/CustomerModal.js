import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["member", "guest"], required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, unique: true },
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    govId: { type: String },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "MembershipPlan" },
    startDate: { type: Date },
    expiryDate: { type: Date },
    profileType: { type: String, enum: ["regular", "vip", "junior", "senior"] },
    preferredTeeTime: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
    },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "INACTIVE" },

    //---- for payment tracking member ----//
    // totalAmount: {
    //   type: Number,
    // },

    // paymentStatus: {
    //   type: String,
    //   enum: ["pending", "partial", "paid"],
    //   default: "pending",
    // },

  },
  { timestamps: true }
);

const CustomerModel = mongoose.model("Customer", customerSchema);
export default CustomerModel;
