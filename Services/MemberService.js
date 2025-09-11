import MemberModel from "../Modals/MemberModal.js";
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
// export const createMember = async (data) => {
//   try {
//     const newMember = new MemberModel(data);

//     const saved = await newMember.save();
//     return createResponse(
//       statusCodes.CREATED,
//       AddedsuccessMessages.MEMBER,
//       saved
//     );
//   } catch (err) {
//     return createResponse(
//       statusCodes.INTERNAL_SERVER_ERROR,
//       errorMessages.INTERNAL_SERVER_ERROR
//     );
//   }
// };

export const createMember = async (data) => {
  try {
    let endDate = null;

    if (data.plan) {
      const plan = await MembershipPlanModel.findById(data.plan);

      if (!plan) {
        return createResponse(statusCodes.NOT_FOUND, notFount.PLAN);
      }

      const startDate = new Date(data.startDate);

      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + plan.numberOfDays);
    }

    const memberData = {
      ...data,
      endDate: endDate.toISOString(),
    };

    const newMember = new MemberModel(memberData);
    const saved = await newMember.save();

    return createResponse(
      statusCodes.CREATED,
      AddedsuccessMessages.MEMBER,
      saved
    );
  } catch (err) {
    console.error("Error creating member:", err);
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

//GET-ALL
export const getAllMembers = async () => {
  try {
    const members = await MemberModel.find()
      .populate("course", "name")
      .populate("plan", "title");

    return createResponse(statusCodes.OK, null, members);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

//GET-BY-ID
export const getMemberById = async (id) => {
  try {
    const member = await MemberModel.findById(id)
      .populate("course", "name")
      .populate("plan", "title");

    if (!member) {
      return createResponse(statusCodes.NOT_FOUND, notFount.MEMBER);
    }

    return createResponse(statusCodes.OK, commonMessage.SUCCESS, member);
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

//UPDATE
export const updateMember = async (id, updateData) => {
  try {
    const updated = await MemberModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return createResponse(statusCodes.NOT_FOUND, notFount.MEMBER);
    }

    return createResponse(
      statusCodes.OK,
      UpdatedsuccessMessages.MEMBER,
      updated
    );
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};

//DELETE
export const deleteMember = async (id) => {
  try {
    const deleted = await MemberModel.findByIdAndDelete(id);

    if (!deleted) {
      return createResponse(statusCodes.NOT_FOUND, notFount.MEMBER);
    }

    return createResponse(
      statusCodes.OK,
      DeletedsuccessMessages.MEMBER,
      deleted
    );
  } catch (err) {
    return createResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      errorMessages.INTERNAL_SERVER_ERROR
    );
  }
};
