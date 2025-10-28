import express from "express";
import {
    createRentalController,
    getAllRentalsController,
    getRentalByIdController,
    updateRentalController,
    cancelRentalController,
    getRentalsByStatusController,
} from "../Controllers/RentalController.js";

const rentalRouter = express.Router();

rentalRouter.post("/create", createRentalController);
rentalRouter.get("/get-all", getAllRentalsController);
rentalRouter.get("/get/:id", getRentalByIdController);
rentalRouter.put("/update/:id", updateRentalController);
rentalRouter.patch("/cancel/:id", cancelRentalController);
rentalRouter.get("/status/:status", getRentalsByStatusController);

export default rentalRouter;
