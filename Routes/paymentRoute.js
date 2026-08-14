import express from "express";
import {
    createPaymentController,
    getPaymentsController,
    getPaymentByIdController,
    updatePaymentController,
    deletePaymentController
} from "../Controllers/paymentController.js";
import { verifyToken, authorizeRoles, ROLES } from "../helper/Auth.js";

const paymentRouter = express.Router();

paymentRouter.use(verifyToken);

paymentRouter.get("/get-all", authorizeRoles(...ROLES.OPERATIONS), getPaymentsController);
paymentRouter.get("/:id", authorizeRoles(...ROLES.MANAGEMENT), getPaymentByIdController);
paymentRouter.post("/create", authorizeRoles(...ROLES.MANAGEMENT), createPaymentController);
paymentRouter.put("/update/:id", authorizeRoles(...ROLES.MANAGEMENT), updatePaymentController);
paymentRouter.delete("/delete/:id", authorizeRoles(...ROLES.MANAGEMENT), deletePaymentController);

export default paymentRouter;
