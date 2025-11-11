import * as authServices from "../Services/UserService.js"
import { sendResponse } from "../helper/responseHelper.js";

export const loginUserController = async (req, res) => {
    const result = await authServices.loginUser(req.body);
    return sendResponse(res, result);
};

export const getUserByIdcontroller = async (req, res) => {
    const id = req.params.id;
    const result = await authServices.getUserById(id);
    return sendResponse(res, result);
}

export const editUserProfileController = async (req, res) => {
    const id = req.params.id;
    const result = await authServices.editUserProfileData(id, req.body);
    return sendResponse(res, result);
}