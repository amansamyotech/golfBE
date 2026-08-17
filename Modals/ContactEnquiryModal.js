import mongoose from "mongoose";

const contactEnquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    clubName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    operationType: {
      type: String,
      trim: true,
      default: "Golf Club",
    },
    message: { type: String, trim: true, default: "" },
    agreedToTerms: { type: Boolean, required: true, default: false },
    source: { type: String, default: "landing" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ContactEnquiryModel = mongoose.model("ContactEnquiry", contactEnquirySchema);
export default ContactEnquiryModel;
