import express from "express";
import {
    createRentalController,
    getAllRentalsController,
    getRentalByIdController,
    cancelRentalController,
    getRentalsByStatusController,
    returnRentalController,
    updateRentalController,
    updateRentalStatusController,
    makePaymentForRentalController
} from "../Controllers/RentalController.js";
import { verifyToken, authorizeRoles, ROLES } from "../helper/Auth.js";

const rentalRouter = express.Router();

rentalRouter.use(verifyToken);
rentalRouter.use(authorizeRoles(...ROLES.OPERATIONS));

rentalRouter.post("/create", createRentalController);
rentalRouter.get("/get-all", getAllRentalsController);
rentalRouter.get("/get/:id", getRentalByIdController);
rentalRouter.put("/return/:id", returnRentalController);
rentalRouter.put("/cancel/:id", cancelRentalController);
rentalRouter.get("/status/:status", getRentalsByStatusController);
rentalRouter.put("/update-status/:id", updateRentalStatusController);
rentalRouter.put("/update/:id", updateRentalController);
rentalRouter.put("/make-payment/:id", makePaymentForRentalController);

export default rentalRouter;
