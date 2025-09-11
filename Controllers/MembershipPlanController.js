import * as planService from "../Services/MembershipPlanService.js"
import { sendResponse } from "../helper/responseHelper.js";

export const createPlanController = async (req, res) => {
  const { title, description, price, numberOfDays } = req.body;

  const data = {
    title,
    description,
    price,
    numberOfDays,
  };

  if (req.files && req.files.planImage && req.files.planImage[0]) {
    data.planImage = `/images/${req.files.planImage[0].filename}`;
  }

  const result = await planService.createPlan(data);
  return sendResponse(res, result);
};

export const getPlansController = async (req, res) => {
  const result = await planService.getAllPlans();
  return sendResponse(res, result);
};

export const getPlanByIdController = async (req, res) => {
  const { id } = req.params;
  const result = await planService.getPlanById(id);
  return sendResponse(res, result);
};

export const updatePlanController = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, numberOfDays } = req.body;

  const data = {
    title,
    description,
    price,
    numberOfDays,
  };

  if (req.files && req.files.planImage && req.files.planImage[0]) {
    data.planImage = `/images/${req.files.planImage[0].filename}`;
  }
  const result = await planService.updatePlan(id, data);
  return sendResponse(res, result);
};

export const deletePlanController = async (req, res) => {
  const { id } = req.params;
  const result = await planService.deletePlan(id);
  return sendResponse(res, result);
};
