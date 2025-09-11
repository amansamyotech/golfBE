import * as memberService from "../Services/MemberService.js";
import { sendResponse } from "../helper/responseHelper.js";

export const createMemberController = async (req, res) => {
  const {
    name,
    email,
    phone,
    dob,
    gender,
    plan,
    startDate,
    teeTime,
    course,
    profileType,
  } = req.body;

  const data = {
    name,
    email,
    phone,
    dob,
    gender,
    plan,
    startDate,
    teeTime,
    course,
    profileType,
  };

  
  

  if (req.files && req.files.image && req.files.image[0]) {
    data.image = `/images/${req.files.image[0].filename}`;
  }

  const result = await memberService.createMember(data);
  return sendResponse(res, result);
};

export const getAllMembersController = async (req, res) => {
  const result = await memberService.getAllMembers();
  return sendResponse(res, result);
};

export const getMemberByIdController = async (req, res) => {
  const { id } = req.params;
  const result = await memberService.getMemberById(id);
  return sendResponse(res, result);
};

export const updateMemberController = async (req, res) => {
  const { id } = req.params;

  const {
    name,
    email,
    phone,
    dob,
    gender,
    plan,
    startDate,
    endDate,
    teeTime,
    course,
    profileType,
  } = req.body;

  const data = {
    name,
    email,
    phone,
    dob,
    gender,
    plan,
    startDate,
    endDate,
    teeTime,
    course,
    profileType,
  };

  if (req.files && req.files.image && req.files.image[0]) {
    data.image = `/images/${req.files.image[0].filename}`;
  }

  const result = await memberService.updateMember(id, data);
  return sendResponse(res, result);
};

export const deleteMemberController = async (req, res) => {
  const { id } = req.params;
  const result = await memberService.deleteMember(id);
  return sendResponse(res, result);
};
