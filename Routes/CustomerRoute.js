import express from "express";
import {
  createCustomerController,
  getAllCustomersController,
  getCustomerByIdController,
  updateCustomerController,
  deleteCustomerController,
} from "../Controllers/CustomerController.js";
import fileHandler from "../middleware/FileHandler.js";

const customerRouter = express.Router();

customerRouter.post("/create", fileHandler(), createCustomerController);
customerRouter.get("/get-all", getAllCustomersController);
customerRouter.get("/:id", getCustomerByIdController);
customerRouter.put("/update/:id", fileHandler(), updateCustomerController);
customerRouter.delete("/delete/:id", deleteCustomerController);

export default customerRouter;
