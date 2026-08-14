import express from "express";
import {
  createMemberController,
  getAllMembersController,
  getMemberByIdController,
  updateMemberController,
  deleteMemberController,
} from "../Controllers/MemberController.js";
import fileHandler from "../middleware/FileHandler.js";
import { verifyToken, authorizeRoles, ROLES } from "../helper/Auth.js";

const memberRouter = express.Router();

memberRouter.use(verifyToken);
memberRouter.use(authorizeRoles(...ROLES.OPERATIONS));

memberRouter.post("/create", fileHandler(), createMemberController);
memberRouter.get("/get-all", getAllMembersController);
memberRouter.get("/:id", getMemberByIdController);
memberRouter.put("/update/:id", fileHandler(), updateMemberController);
memberRouter.delete("/delete/:id", deleteMemberController);

export default memberRouter;
