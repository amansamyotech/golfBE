import express from "express";
import {
    createPaymentController,
    getPaymentsController,
    getPaymentByIdController,
    updatePaymentController,
    deletePaymentController
} from "../Controllers/paymentController.js";

const paymentRouter = express.Router();
paymentRouter.post("/create", createPaymentController);
paymentRouter.get("/get-all", getPaymentsController);
paymentRouter.get("/:id", getPaymentByIdController);
paymentRouter.put("/update/:id", updatePaymentController);
paymentRouter.delete("/delete/:id", deletePaymentController);   

export default paymentRouter;