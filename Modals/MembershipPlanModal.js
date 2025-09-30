import mongoose from "mongoose";

const membershipplanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    numberOfDays: {
      type: Number,
      required: true,
    },
    // planImage: {
    //   type: String,
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

const MembershipPlanModel = mongoose.model(
  "MembershipPlan",
  membershipplanSchema
);
export default MembershipPlanModel;
