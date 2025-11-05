import * as authServices from "../Services/UserService.js"
import { sendResponse } from "../helper/responseHelper.js";

export const loginUserController = async (req, res) => {
    const result = await authServices.loginUser(req.body);
    return sendResponse(res, result);
};