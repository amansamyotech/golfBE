import express from "express";
import { loginUserController, getUserByIdcontroller, editUserProfileController, changePasswordController } from "../Controllers/UserController.js";
import { verifyToken } from "../helper/Auth.js";

const authRouter = express.Router();

authRouter.post("/login", loginUserController);
authRouter.get("/profile/:id", verifyToken, getUserByIdcontroller);
authRouter.put("/update/:id", verifyToken, editUserProfileController);
authRouter.put("/change-password/:id", verifyToken, changePasswordController);

export default authRouter;
