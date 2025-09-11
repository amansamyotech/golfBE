import employeeModel from "../Modals/StaffModal.js";
import {
  AddedFailedMessages,
  AddedsuccessMessages,
  UpdatedsuccessMessages,
  notFount,
  DeletedsuccessMessages,
  requiredMessage,
  errorMessages,
} from "../Core/messages.js";
import { statusCodes } from "../Core/constant.js";
import { createResponse } from "../helper/responseHelper.js";

// CREATE
export const createEmployee = async (data) => {
  try {
    const newEmployee = new employeeModel(data);
    const saved = await newEmployee.save();
    return createResponse(
      statusCodes.CREATED,
      AddedsuccessMessages.EMPLOYEE,
      saved
    );
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

// GET-ALL
export const getAllEmployees = async () => {
  try {
    const employees = await employeeModel.find();
    return createResponse(statusCodes.OK, null, employees);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

//GET-BY-ID
export const getEmployeeById = async (id) => {
  try {
    const employee = await employeeModel.findById(id);
    if (!employee) {
      return createResponse(statusCodes.NOT_FOUND, notFount.EMPLOYEE);
    }
    return createResponse(statusCodes.OK, null, employee);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

//UPDATE
export const updateEmployee = async (id, data) => {
  try {
    const updated = await employeeModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updated) {
      return createResponse(statusCodes.NOT_FOUND, notFount.EMPLOYEE);
    }
    return createResponse(
      statusCodes.OK,
      UpdatedsuccessMessages.EMPLOYEE,
      updated
    );
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

//DETELE
export const deleteEmployee = async (id) => {
  try {
    const deleted = await employeeModel.findByIdAndDelete(id);
    if (!deleted) {
      return createResponse(statusCodes.NOT_FOUND, notFount.EMPLOYEE);
    }
    return createResponse(statusCodes.OK, DeletedsuccessMessages.EMPLOYEE);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};
