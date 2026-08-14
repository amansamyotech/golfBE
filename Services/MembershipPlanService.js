import MembershipPlanModel from "../Modals/MembershipPlanModal.js";
import {
  AddedFailedMessages,
  AddedsuccessMessages,
  UpdatedsuccessMessages,
  notFount,
  DeletedsuccessMessages,
  requiredMessage,
  errorMessages,
  commonMessage,
} from "../Core/messages.js";
import { statusCodes } from "../Core/constant.js";
import { createResponse } from "../helper/responseHelper.js";

// CREATE
export const createPlan = async (data) => {
  try {
    const newPlan = new MembershipPlanModel(data);
    const saved = await newPlan.save();
    return createResponse(
      statusCodes.CREATED,
      AddedsuccessMessages.PLAN,
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
export const getAllPlans = async () => {
  try {
    const plans = await MembershipPlanModel.find();
    return createResponse(statusCodes.OK, commonMessage.SUCCESS, plans);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

// GET BY ID
export const getPlanById = async (id) => {
  try {
    const plan = await MembershipPlanModel.findById(id);
    if (!plan) {
      return createResponse(statusCodes.NOT_FOUND, notFount.PLAN);
    }
    return createResponse(statusCodes.OK, commonMessage.SUCCESS, plan);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

// UPDATE
export const updatePlan = async (id, data) => {
  try {
    const updatedPlan = await MembershipPlanModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedPlan) {
      return createResponse(statusCodes.NOT_FOUND, notFount.PLAN);
    }

    return createResponse(
      statusCodes.OK,
      UpdatedsuccessMessages.PLAN,
      updatedPlan
    );
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

// DELETE
export const deletePlan = async (id) => {
  try {
    const deleted = await MembershipPlanModel.findByIdAndDelete(id);

    if (!deleted) {
      return createResponse(statusCodes.NOT_FOUND, notFount.PLAN);
    }

    return createResponse(statusCodes.Ok, DeletedsuccessMessages.PLAN);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};
