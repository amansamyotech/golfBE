import express from "express";
import { loginUserController } from "../Controllers/UserController.js";

const authRouter = express.Router();

authRouter.post("/login", loginUserController);

export default authRouter;
