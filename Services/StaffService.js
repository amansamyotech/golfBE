import employeeModel from "../Modals/StaffModal.js";
import UserModel from "../Modals/User.js";
import bcrypt from "bcryptjs";
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

const splitName = (name) => {
  const parts = String(name || "Staff User").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "Staff",
    lastName: parts.slice(1).join(" ") || parts[0] || "User",
  };
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const emailRegex = (email) =>
  new RegExp(`^${normalizeEmail(email).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
const normalizeRole = (role) => (role === "Manager" ? "Manager" : "Staff");

const createStaffLoginUser = async ({ name, email, phone, address, password, role }) => {
  const { firstName, lastName } = splitName(name);
  const hashedPassword = await bcrypt.hash(password, 10);
  return UserModel.create({
    firstName,
    lastName,
    email: normalizeEmail(email),
    password: hashedPassword,
    phone: phone || "",
    address: address || "",
    role: normalizeRole(role),
  });
};

const syncStaffLoginUser = async (employee, { password, role } = {}) => {
  if (!employee?.email) return;
  const email = normalizeEmail(employee.email);
  const nextRole = normalizeRole(role || employee.role || "Staff");
  const existingUser = await UserModel.findOne({ email: emailRegex(email) });
  const { firstName, lastName } = splitName(employee.name);

  if (!existingUser) {
    if (!password) {
      throw new Error("Login password is required to create a user account");
    }
    await createStaffLoginUser({
      name: employee.name,
      email,
      phone: employee.phone,
      address: employee.address,
      password,
      role: nextRole,
    });
    return;
  }

  const updates = {
    firstName,
    lastName,
    email,
    phone: employee.phone || existingUser.phone || "",
    address: employee.address || existingUser.address || "",
    role: nextRole,
  };
  if (password) {
    updates.password = await bcrypt.hash(password, 10);
  }
  await UserModel.findByIdAndUpdate(existingUser._id, updates);
};

// CREATE
export const createEmployee = async (data) => {
  try {
    const { password, role, ...rest } = data;
    const staffRole = normalizeRole(role);
    const employeeData = {
      ...rest,
      email: normalizeEmail(rest.email),
      role: staffRole,
    };

    if (!employeeData.email) {
      return createResponse(statusCodes.BAD_REQ, "Email is required");
    }

    if (!password) {
      return createResponse(
        statusCodes.BAD_REQ,
        "Login password is required to create staff"
      );
    }

    const existingUser = await UserModel.findOne({ email: emailRegex(employeeData.email) });
    const existingEmployee = await employeeModel.findOne({
      email: emailRegex(employeeData.email),
    });

    // Staff exists but has no login yet → create login and keep existing staff
    if (existingEmployee && !existingUser) {
      await createStaffLoginUser({
        name: existingEmployee.name || employeeData.name,
        email: employeeData.email,
        phone: existingEmployee.phone || employeeData.phone,
        address: existingEmployee.address || employeeData.address,
        password,
        role: staffRole,
      });
      await employeeModel.findByIdAndUpdate(existingEmployee._id, { role: staffRole });
      return createResponse(
        statusCodes.CREATED,
        "Login account created for existing staff",
        existingEmployee
      );
    }

    if (existingUser || existingEmployee) {
      return createResponse(
        statusCodes.CONFLICT,
        "A staff or user with this email already exists"
      );
    }

    const newEmployee = new employeeModel(employeeData);
    const saved = await newEmployee.save();

    try {
      await createStaffLoginUser({
        name: employeeData.name,
        email: employeeData.email,
        phone: employeeData.phone,
        address: employeeData.address,
        password,
        role: staffRole,
      });
    } catch (userErr) {
      console.error("Error creating login user for staff:", userErr);
      await employeeModel.findByIdAndDelete(saved._id);
      return createResponse(
        statusCodes.INTERNAL_SERVER_ERROR,
        "Could not create a login account for this staff member. Please try again."
      );
    }

    return createResponse(
      statusCodes.CREATED,
      AddedsuccessMessages.EMPLOYEE,
      saved
    );
  } catch (err) {
    console.error("Error creating employee:", err);
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

// GET-BY-EMAIL
export const getEmployeeByEmail = async (email) => {
  try {
    if (!email) {
      return createResponse(statusCodes.BAD_REQ, "Email is required");
    }
    const employee = await employeeModel.findOne({ email: emailRegex(email) });
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
    const { password, role, ...rest } = data;
    const employeeData = { ...rest };
    if (employeeData.email) {
      employeeData.email = normalizeEmail(employeeData.email);
    }
    if (role) {
      employeeData.role = normalizeRole(role);
    }

    const updated = await employeeModel.findByIdAndUpdate(id, employeeData, {
      new: true,
    });
    if (!updated) {
      return createResponse(statusCodes.NOT_FOUND, notFount.EMPLOYEE);
    }

    try {
      await syncStaffLoginUser(updated, {
        password,
        role: employeeData.role || updated.role,
      });
    } catch (userErr) {
      console.error("Error syncing staff login user:", userErr);
      // Employee update succeeded; login sync may need password on next edit
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
    // Also remove the login User account for this staff member
    if (deleted.email) {
      await UserModel.deleteOne({ email: emailRegex(deleted.email) });
    }
    return createResponse(statusCodes.OK, DeletedsuccessMessages.EMPLOYEE);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};
//STATUS CHANGE WORKING SHIFT
export const changeWorkingShiftStatus = async (id, workShift) => {
  try {
    const employee = await employeeModel.findById(id);

    if (!employee) {
      return createResponse(
        statusCodes.BAD_REQUEST,
        'Employe Not Found'
      );
    }

    const updatedShift = await employeeModel.findByIdAndUpdate(
      id,
      { workShift: workShift },
      { new: true }
    );

    return createResponse(
      statusCodes.OK,
      UpdatedsuccessMessages.STAFF,
      updatedShift
    );

  } catch (err) {
    console.error("Error updating working shift status:", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

// STATUS CHANGE AVAILABILITY STATUS
export const changeAvailabilityStatus = async (id, availabilityStatus) => {
  try {
    const employee = await employeeModel.findById(id);

    if (!employee) {
      return createResponse(
        statusCodes.BAD_REQUEST,
        'Employee Not Found'
      );
    }

    // Allowed status values:
    const allowedStatuses = ["available", "assigned", "onleave", "inactive"];
    if (!allowedStatuses.includes(availabilityStatus)) {
      return createResponse(
        statusCodes.BAD_REQUEST,
        "Invalid Availability Status"
      );
    }

    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      id,
      { availabilityStatus: availabilityStatus },
      { new: true }
    );

    return createResponse(
      statusCodes.OK,
      UpdatedsuccessMessages.STAFF,
      updatedEmployee
    );

  } catch (err) {
    console.error("Error updating availability status:", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

