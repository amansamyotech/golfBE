import ContactEnquiryModel from "../Modals/ContactEnquiryModal.js";
import { createResponse } from "../helper/responseHelper.js";
import { statusCodes } from "../Core/constant.js";
import { errorMessages } from "../Core/messages.js";

export const createContactEnquiry = async (data) => {
  try {
    const fullName = String(data.fullName || data.fname || "").trim();
    const clubName = String(data.clubName || data.club || "").trim();
    const email = String(data.email || "").trim().toLowerCase();
    const phone = String(data.phone || "").trim();
    const operationType = String(data.operationType || data.size || "Golf Club").trim();
    const message = String(data.message || "").trim();
    const agreedToTerms = Boolean(data.agreedToTerms);

    if (!fullName || !clubName || !email) {
      return createResponse(
        statusCodes.BAD_REQ,
        "Full name, club name, and email are required"
      );
    }

    if (!agreedToTerms) {
      return createResponse(
        statusCodes.BAD_REQ,
        "You must agree to the Terms and Privacy Policy"
      );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return createResponse(statusCodes.BAD_REQ, "Please enter a valid email address");
    }

    const enquiry = await ContactEnquiryModel.create({
      fullName,
      clubName,
      email,
      phone,
      operationType,
      message,
      agreedToTerms,
      source: data.source || "landing",
    });

    return createResponse(
      statusCodes.CREATED,
      "Enquiry submitted successfully",
      enquiry
    );
  } catch (err) {
    console.error("createContactEnquiry error:", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const getAllContactEnquiries = async () => {
  try {
    const list = await ContactEnquiryModel.find({ isDeleted: false }).sort({
      createdAt: -1,
    });
    return createResponse(statusCodes.OK, null, list);
  } catch (err) {
    console.error("getAllContactEnquiries error:", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};
