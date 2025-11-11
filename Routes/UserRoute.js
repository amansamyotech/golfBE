import express from "express";
import { loginUserController, getUserByIdcontroller, editUserProfileController } from "../Controllers/UserController.js";
import { verifyToken } from "../helper/Auth.js";

const authRouter = express.Router();

authRouter.post("/login", loginUserController);
authRouter.get("/profile/:id", verifyToken, getUserByIdcontroller);
authRouter.put("/update/:id", verifyToken, editUserProfileController);

export default authRouter;
