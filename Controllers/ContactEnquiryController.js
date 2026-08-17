import * as contactService from "../Services/ContactEnquiryService.js";
import { sendResponse } from "../helper/responseHelper.js";

export const createContactEnquiryController = async (req, res) => {
  const result = await contactService.createContactEnquiry(req.body);
  return sendResponse(res, result);
};

export const getAllContactEnquiriesController = async (req, res) => {
  const result = await contactService.getAllContactEnquiries();
  return sendResponse(res, result);
};
