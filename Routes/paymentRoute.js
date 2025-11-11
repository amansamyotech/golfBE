import express from "express";
import {
    createPaymentController,
    getPaymentsController,
    getPaymentByIdController,
    updatePaymentController,
    deletePaymentController
} from "../Controllers/paymentController.js";
import { verifyToken } from "../helper/Auth.js";

const paymentRouter = express.Router();

paymentRouter.use(verifyToken);

paymentRouter.post("/create", createPaymentController);
paymentRouter.get("/get-all", getPaymentsController);
paymentRouter.get("/:id", getPaymentByIdController);
paymentRouter.put("/update/:id", updatePaymentController);
paymentRouter.delete("/delete/:id", deletePaymentController);   

export default paymentRouter;