import express from "express";
import {
  createContactEnquiryController,
  getAllContactEnquiriesController,
} from "../Controllers/ContactEnquiryController.js";
import { verifyToken, authorizeRoles } from "../helper/Auth.js";

const contactRouter = express.Router();

// Public — landing page enquiry form
contactRouter.post("/create", createContactEnquiryController);

// SuperAdmin / Manager can view landing-page enquiries
contactRouter.get(
  "/get-all",
  verifyToken,
  authorizeRoles("SuperAdmin", "Manager"),
  getAllContactEnquiriesController
);

export default contactRouter;
