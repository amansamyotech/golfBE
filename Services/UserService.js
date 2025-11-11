import UserModel from "../Modals/User.js";
import {
    commonMessage,
    errorMessages,
    notFount,
    requiredMessage,
} from "../Core/messages.js";
import { statusCodes } from "../Core/constant.js";
import { createResponse } from "../helper/responseHelper.js";
import { generateToken } from "../middleware/Auth.js";

export const loginUser = async (data) => {
    try {
        const { email, password } = data;

        if (!email || !password) {
            return createResponse(
                statusCodes.BAD_REQ,
                'Email and Password is Required'
            );
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return createResponse(statusCodes.NOT_FOUND, notFount.USER);
        }

        if (user.password !== password) {
            return createResponse(
                statusCodes.UNAUTHORIZED,
                commonMessage.INVALID_PASSWORD
            );
        }

        const token = generateToken(user);
        return createResponse(
            statusCodes.CREATED,
            commonMessage.LOGIN_SUCCESS,
            user,
            token
        );
    } catch (err) {
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const getUserById = async (id) => {
    try {
        const user = await UserModel.findById(id);
        if (!user) {
            return createResponse(statusCodes.NOT_FOUND, 'User not found');
        }
        return createResponse(statusCodes.OK, commonMessage.SUCCESS, user);
    } catch (err) {
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const editUserProfileData = async (id, data) => {
    try {
        const user = await UserModel.findById(id);
        if (!user) {
            return createResponse(statusCodes.NOT_FOUND, 'User not found');
        }

        const updatedUser = await UserModel.findByIdAndUpdate(id, data, {
            new: true,
        });

        return createResponse(statusCodes.OK, 'Profile Data Updated Successfully', updatedUser);
    } catch (err) {
        console.error("Error updating user profile:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};


