import express from "express";
import {
  createCustomerController,
  getAllCustomersController,
  getCustomerByIdController,
  updateCustomerController,
  updateCustomerStatusController,
  deleteCustomerController,
} from "../Controllers/CustomerController.js";
import fileHandler from "../middleware/FileHandler.js";
import { verifyToken, authorizeRoles, ROLES } from "../helper/Auth.js";

const customerRouter = express.Router();

customerRouter.use(verifyToken);
customerRouter.use(authorizeRoles(...ROLES.OPERATIONS));

customerRouter.post("/create", fileHandler(), createCustomerController);
customerRouter.get("/get-all", getAllCustomersController);
customerRouter.put("/update-status/:id", updateCustomerStatusController);
customerRouter.get("/:id", getCustomerByIdController);
customerRouter.put("/update/:id", fileHandler(), updateCustomerController);
customerRouter.delete("/delete/:id", deleteCustomerController);

export default customerRouter;
