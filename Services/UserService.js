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
            statusCodes.OK,
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
