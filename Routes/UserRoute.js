import express from "express";
import { loginUserController, getUserByIdcontroller } from "../Controllers/UserController.js";

const authRouter = express.Router();

authRouter.post("/login", loginUserController);
authRouter.get("/profile/:id", getUserByIdcontroller);

export default authRouter;
