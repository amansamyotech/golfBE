import express from "express";
import {
  createMemberController,
  getAllMembersController,
  getMemberByIdController,
  updateMemberController,
  deleteMemberController,
} from "../Controllers/MemberController.js";
import fileHandler from "../middleware/FileHandler.js";
import { verifyToken } from "../helper/Auth.js";

const memberRouter = express.Router();

memberRouter.use(verifyToken);

memberRouter.post("/create", fileHandler(), createMemberController);
memberRouter.get("/get-all", getAllMembersController);
memberRouter.get("/:id", getMemberByIdController);
memberRouter.put("/update/:id", fileHandler(), updateMemberController);
memberRouter.delete("/delete/:id", deleteMemberController);

export default memberRouter;
