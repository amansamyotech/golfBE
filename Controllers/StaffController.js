import * as staffService from "../Services/StaffService.js";
import { sendResponse } from "../helper/responseHelper.js";

export const createStaffController = async (req, res) => {
  const {
    name,
    email,
    phone,
    gender,
    address,
    jobTitle,
    department,
    employmentType,
    dateOfJoining,
    workShift,
    salary,
  } = req.body;

  const data = {
    name,
    email,
    phone,
    gender,
    address,
    jobTitle,
    department,
    employmentType,
    dateOfJoining,
    workShift,
    salary,
  };

  if (req.files && req.files.staffProfileImg && req.files.staffProfileImg[0]) {
    data.profileImg = `/images/${req.files.staffProfileImg[0].filename}`;
  }

  const result = await staffService.createEmployee(data);
  return sendResponse(res, result);
};

export const getAllStaffController = async (req, res) => {
  const result = await staffService.getAllEmployees();
  return sendResponse(res, result);
};

export const getStaffByIdController = async (req, res) => {
  const { id } = req.params;
  const result = await staffService.getEmployeeById(id);
  return sendResponse(res, result);
};

export const updateStaffController = async (req, res) => {
  const { id } = req.params;

  const {
    name,
    email,
    phone,
    gender,
    address,
    jobTitle,
    department,
    employmentType,
    dateOfJoining,
    workShift,
    salary,
  } = req.body;

  const data = {
    name,
    email,
    phone,
    gender,
    address,
    jobTitle,
    department,
    employmentType,
    dateOfJoining,
    workShift,
    salary,
  };

  if (req.files && req.files.staffProfileImg && req.files.staffProfileImg[0]) {
    data.profileImg = `/images/${req.files.staffProfileImg[0].filename}`;
  }
  const result = await staffService.updateEmployee(id, data);
  return sendResponse(res, result);
};

export const deleteStaffController = async (req, res) => {
  const { id } = req.params;
  const result = await staffService.deleteEmployee(id);
  return sendResponse(res, result);
};
