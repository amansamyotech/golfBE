import express from "express";
import { loginUserController, getUserByIdcontroller } from "../Controllers/UserController.js";
import { verifyToken } from "../helper/Auth.js";

const authRouter = express.Router();

authRouter.post("/login", loginUserController);
authRouter.get("/profile/:id", verifyToken, getUserByIdcontroller);

export default authRouter;
