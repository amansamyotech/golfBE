import CustomerModel from "../Modals/CustomerModal.js";
import MembershipPlanModel from "../Modals/MembershipPlanModal.js";
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
    // 1️⃣ Fetch the Membership Plan
    const plan = await MembershipPlanModel.findById(data.plan);

    if (!plan) {
      return createResponse(statusCodes.BAD_REQUEST, notFound.PLAN);
    }

    // Calculate expiryDate
    const startDate = new Date(data.startDate);
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + plan.numberOfDays - 1);

    // Add expiryDate to data
    data.expiryDate = expiryDate;

    const newCustomer = new CustomerModel(data);

    const saved = await newCustomer.save();
    return createResponse(
      statusCodes.CREATED,
      AddedsuccessMessages.CUSTOMER,
      saved
    );
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

// GET
export const getCustomer = async () => {
  try {
    const customer = await CustomerModel.find().populate("plan", "title");
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
// export const updateCustomer = async (id, data) => {
//   try {
//     const updated = await CustomerModel.findByIdAndUpdate(id, data, {
//       new: true,
//     });
//     if (!updated) {
//       return createResponse(statusCodes.NOT_FOUND, notFount.CUSTOMER);
//     }
//     return createResponse(
//       statusCodes.OK,
//       UpdatedsuccessMessages.CUSTOMER,
//       updated
//     );
//   } catch (err) {
//     return createResponse(
//       statusCodes.INTERNAL_SERVER_ERROR,
//       errorMessages.INTERNAL_SERVER_ERROR
//     );
//   }
// };

export const updateCustomer = async (id, data) => {
  try {
    let updatedData = { ...data };

    // Fetch existing customer to compare startDate and plan
    const existingCustomer = await CustomerModel.findById(id);
    if (!existingCustomer) {
      return createResponse(statusCodes.NOT_FOUND, notFound.CUSTOMER);
    }

    // Compare existing and incoming startDate (ignoring time, only date)
    const existingStartDate = existingCustomer.startDate
      ? new Date(existingCustomer.startDate).toDateString()
      : null;
    const incomingStartDate = new Date(data.startDate).toDateString();

    // Check if plan is provided and has changed
    const isPlanProvided = data.plan !== undefined;

    const existingPlanId = existingCustomer.plan
      ? existingCustomer.plan.toString()
      : null;

    const incomingPlanId = isPlanProvided
      ? data.plan.toString()
      : existingPlanId;

    // Recalculate expiryDate if startDate or plan has changed
    if (
      existingStartDate !== incomingStartDate ||
      existingPlanId !== incomingPlanId
    ) {
      // Use incoming plan if provided, otherwise use existing plan
      const planId = isPlanProvided ? data.plan : existingCustomer.plan;
      if (!planId) {
        return createResponse(statusCodes.NOT_FOUND, notFound.MEMBERSHIP_PLAN);
      }

      const plan = await MembershipPlanModel.findById(planId);
      if (!plan) {
        return createResponse(statusCodes.NOT_FOUND, notFound.MEMBERSHIP_PLAN);
      }

      // Calculate new expiry date based on numberOfDays
      const startDate = new Date(data.startDate);
      const expiryDate = new Date(startDate);
      expiryDate.setDate(startDate.getDate() + plan.numberOfDays);
      updatedData.expiryDate = expiryDate;
    }

    // Update the customer with the modified data
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

// DELETE Customer by ID
export const deleteCustomer = async (id) => {
  try {
    const deleted = await CustomerModel.findByIdAndDelete(id);
    if (!deleted) {
      return createResponse(statusCodes.NOT_FOUND, notFound.CUSTOMER);
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
