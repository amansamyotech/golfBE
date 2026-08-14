import UserModel from "../Modals/User.js";
import bcrypt from "bcryptjs";
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
        const email = String(data.email || "").trim().toLowerCase();
        const password = data.password;

        if (!email || !password) {
            return createResponse(
                statusCodes.BAD_REQ,
                'Email and Password is Required'
            );
        }

        const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const user = await UserModel.findOne({ email: new RegExp(`^${escaped}$`, "i") });

        if (!user) {
            return createResponse(statusCodes.NOT_FOUND, notFount.USER);
        }

        let isMatch = false;
        try {
            if (user.password && String(user.password).startsWith("$2")) {
                isMatch = await bcrypt.compare(password, user.password);
            } else {
                isMatch = user.password === password;
            }
        } catch {
            isMatch = user.password === password;
        }
        if (!isMatch) {
            return createResponse(
                statusCodes.UNAUTHORIZED,
                commonMessage.INVALID_PASSWORD
            );
        }

        const token = generateToken(user);
        const userSafe = user.toObject();
        delete userSafe.password;
        return createResponse(
            statusCodes.CREATED,
            commonMessage.LOGIN_SUCCESS,
            userSafe,
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

        // Hash password if it's being updated
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(data.password, salt);
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

export const changePassword = async (id, data) => {
    try {
        const { currentPassword, newPassword } = data;

        if (!currentPassword || !newPassword) {
            return createResponse(statusCodes.BAD_REQ, 'Current password and new password are required');
        }

        const user = await UserModel.findById(id);
        if (!user) {
            return createResponse(statusCodes.NOT_FOUND, 'User not found');
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return createResponse(statusCodes.UNAUTHORIZED, 'Current password is incorrect');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await UserModel.findByIdAndUpdate(id, { password: hashedPassword });

        return createResponse(statusCodes.OK, 'Password changed successfully');
    } catch (err) {
        console.error("Error changing password:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};
