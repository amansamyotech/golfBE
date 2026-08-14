import * as paymentService from "../Services/paymentService.js";
import { sendResponse } from "../helper/responseHelper.js";

export const createPaymentController = async (req, res) => {
  const result = await paymentService.createPayment(req.body);
  return sendResponse(res, result);
};

//Get All Payments
export const getPaymentsController = async (req, res) => {
  const result = await paymentService.getPayments();
  return sendResponse(res, result);
};

//Get Payment by ID
export const getPaymentByIdController = async (req, res) => {
  const id = req.params.id;
  const result = await paymentService.getPaymentById(id);
  return sendResponse(res, result);
};

//Update Payment
export const updatePaymentController = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const result = await paymentService.updatePayment(id, data);
  return sendResponse(res, result);
};

//Delete Payment (Soft Delete)
export const deletePaymentController = async (req, res) => {
  const id = req.params.id;
  const result = await paymentService.deletePayment(id);
  return sendResponse(res, result);
};
