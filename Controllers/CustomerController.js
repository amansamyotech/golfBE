import * as customerService from "../Services/CustomerService.js";
import { sendResponse } from "../helper/responseHelper.js";

// Create a new customer
export const createCustomerController = async (req, res) => {
  try {
    if (req.files && req.files.govId && req.files.govId[0]) {
      req.body.govId = `/images/${req.files.govId[0].filename}`;
    }

    const result = await customerService.createCustomer(req.body);
    return sendResponse(res, result);
  } catch (error) {
    return sendResponse(res, { success: false, message: error.message });
  }
};

// Get all customers
export const getAllCustomersController = async (req, res) => {
  try {
    const result = await customerService.getCustomer();
    return sendResponse(res, result);
  } catch (error) {
    return sendResponse(res, { success: false, message: error.message });
  }
};

// Get a single customer by ID
export const getCustomerByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await customerService.getCustomerById(id);
    return sendResponse(res, result);
  } catch (error) {
    return sendResponse(res, { success: false, message: error.message });
  }
};

// Update a customer by ID
export const updateCustomerController = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.files && req.files.govId && req.files.govId[0]) {
      req.body.govId = `/images/${req.files.govId[0].filename}`;
    }
    const result = await customerService.updateCustomer(id, req.body);
    return sendResponse(res, result);
  } catch (error) {
    return sendResponse(res, { success: false, message: error.message });
  }
};

// Delete a customer by ID
export const deleteCustomerController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await customerService.deleteCustomer(id);
    return sendResponse(res, result);
  } catch (error) {
    return sendResponse(res, { success: false, message: error.message });
  }
};
