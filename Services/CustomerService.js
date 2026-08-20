import CustomerModel from "../Modals/CustomerModal.js";
import MembershipPlanModel from "../Modals/MembershipPlanModal.js";
import UserModel from "../Modals/User.js";
import bcrypt from "bcryptjs";
import {
  AddedFailedMessages,
  AddedsuccessMessages,
  UpdatedsuccessMessages,
  DeletedsuccessMessages,
  requiredMessage,
  errorMessages,
  commonMessage,
  notFound,
} from "../Core/messages.js";
import { statusCodes } from "../Core/constant.js";
import { createResponse } from "../helper/responseHelper.js";

// CREATE
export const createCustomer = async (data) => {
  try {
    const { password, ...customerData } = data;

    const existingCustomer = await CustomerModel.findOne({ phone: customerData.phone });

    if (existingCustomer) {
      return createResponse(
        statusCodes.CONFLICT,
        "Phone number already exists. Please use a different phone number."
      );
    }

    const plan = await MembershipPlanModel.findById(customerData.plan);

    if (!plan) {
      return createResponse(statusCodes.BAD_REQUEST, notFound.PLAN);
    }

    const startDate = new Date(customerData.startDate);
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + plan.numberOfDays - 1);

    customerData.expiryDate = expiryDate;

    const newCustomer = new CustomerModel(customerData);
    const saved = await newCustomer.save();

    // Create a login User account for this member
    if (saved && customerData.email && password) {
      try {
        const nameParts = String(customerData.name || "Member User").trim().split(/\s+/).filter(Boolean);
        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.create({
          firstName: nameParts[0] || "Member",
          lastName: nameParts.slice(1).join(" ") || nameParts[0] || "User",
          email: String(customerData.email).trim().toLowerCase(),
          password: hashedPassword,
          phone: customerData.phone || "",
          address: "",
          role: "Member",
        });
      } catch (userErr) {
        console.error("Error creating login user for member:", userErr);
        await CustomerModel.findByIdAndDelete(saved._id);
        return createResponse(
          statusCodes.INTERNAL_SERVER_ERROR,
          "Could not create a login account for this member. Please try again."
        );
      }
    }

    return createResponse(
      statusCodes.CREATED,
      AddedsuccessMessages.CUSTOMER,
      saved
    );
  } catch (err) {
    console.error("Error creating customer:", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

// GET
export const getCustomer = async () => {
  try {
    const customer = await CustomerModel.find()
      .populate("plan", "title");

    return createResponse(statusCodes.OK, commonMessage.SUCCESS, customer);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

// GET Single Customer by ID
export const getCustomerById = async (id) => {
  try {
    const customer = await CustomerModel.findById(id).populate("plan", "title");
    if (!customer) {
      return createResponse(statusCodes.NOT_FOUND, notFound.CUSTOMER);
    }
    return createResponse(statusCodes.OK, commonMessage.SUCCESS, customer);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

// UPDATE Customer by ID
export const updateCustomer = async (id, data) => {
  try {
    let updatedData = { ...data };

    const existingCustomer = await CustomerModel.findById(id);
    if (!existingCustomer) {
      return createResponse(statusCodes.NOT_FOUND, notFound.CUSTOMER);
    }

    // Status-only (or partial) updates should not force expiry recalculation
    if (data.startDate) {
      const existingStartDate = existingCustomer.startDate
        ? new Date(existingCustomer.startDate).toDateString()
        : null;
      const incomingStartDate = new Date(data.startDate).toDateString();

      const isPlanProvided = data.plan !== undefined;
      const existingPlanId = existingCustomer.plan
        ? existingCustomer.plan.toString()
        : null;
      const incomingPlanId = isPlanProvided
        ? data.plan.toString()
        : existingPlanId;

      if (
        existingStartDate !== incomingStartDate ||
        existingPlanId !== incomingPlanId
      ) {
        const planId = isPlanProvided ? data.plan : existingCustomer.plan;
        if (!planId) {
          return createResponse(statusCodes.NOT_FOUND, notFound.MEMBERSHIP_PLAN);
        }

        const plan = await MembershipPlanModel.findById(planId);
        if (!plan) {
          return createResponse(statusCodes.NOT_FOUND, notFound.MEMBERSHIP_PLAN);
        }

        const startDate = new Date(data.startDate);
        const expiryDate = new Date(startDate);
        expiryDate.setDate(startDate.getDate() + plan.numberOfDays);
        updatedData.expiryDate = expiryDate;
      }
    }

    if (data.status !== undefined) {
      const normalized = String(data.status).toUpperCase();
      if (!["ACTIVE", "INACTIVE"].includes(normalized)) {
        return createResponse(statusCodes.BAD_REQ, "Invalid customer status");
      }
      updatedData.status = normalized;
    }

    const updated = await CustomerModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updated) {
      return createResponse(statusCodes.NOT_FOUND, notFound.CUSTOMER);
    }

    return createResponse(
      statusCodes.OK,
      UpdatedsuccessMessages.CUSTOMER,
      updated
    );
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateCustomerStatus = async (id, status) => {
  try {
    const normalized = String(status || "").toUpperCase();
    if (!["ACTIVE", "INACTIVE"].includes(normalized)) {
      return createResponse(statusCodes.BAD_REQ, "Invalid customer status");
    }

    const updated = await CustomerModel.findByIdAndUpdate(
      id,
      { status: normalized },
      { new: true }
    );

    if (!updated) {
      return createResponse(statusCodes.NOT_FOUND, notFound.CUSTOMER);
    }

    return createResponse(
      statusCodes.OK,
      UpdatedsuccessMessages.CUSTOMER || "Status updated successfully",
      updated
    );
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

// DELETE Customer by ID
export const deleteCustomer = async (id) => {
  try {
    const deleted = await CustomerModel.findByIdAndDelete(id);
    if (!deleted) {
      return createResponse(statusCodes.NOT_FOUND, notFound.CUSTOMER);
    }
    // Also remove the login User account for this member
    if (deleted.email) {
      await UserModel.deleteOne({ email: deleted.email, role: "Member" });
    }
    return createResponse(
      statusCodes.OK,
      DeletedsuccessMessages.CUSTOMER,
      null
    );
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};
