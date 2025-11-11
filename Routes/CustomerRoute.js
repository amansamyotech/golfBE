import express from "express";
import {
  createCustomerController,
  getAllCustomersController,
  getCustomerByIdController,
  updateCustomerController,
  deleteCustomerController,
} from "../Controllers/CustomerController.js";
import fileHandler from "../middleware/FileHandler.js";
import { verifyToken } from "../helper/Auth.js";

const customerRouter = express.Router();

// applies to all routes below
customerRouter.use(verifyToken);

customerRouter.post("/create", fileHandler(), createCustomerController);
customerRouter.get("/get-all", getAllCustomersController);
customerRouter.get("/:id", getCustomerByIdController);
customerRouter.put("/update/:id", fileHandler(), updateCustomerController);
customerRouter.delete("/delete/:id", deleteCustomerController);

export default customerRouter;
