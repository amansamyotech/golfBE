import * as rentalServices from "../Services/RentalService.js"
import { sendResponse } from "../helper/responseHelper.js";

export const createRentalController = async (req, res) => {
    const result = await rentalServices.createRental(req.body);
    return sendResponse(res, result);
};

export const getAllRentalsController = async (req, res) => {
    const result = await rentalServices.getAllRentals();
    return sendResponse(res, result);
};

export const getRentalByIdController = async (req, res) => {
    const result = await rentalServices.getRentalById(req.params.id);
    return sendResponse(res, result);
};

export const updateRentalController = async (req, res) => {
    const result = await rentalServices.updateRental(req.params.id, req.body);
    return sendResponse(res, result);
};

export const returnRentalController = async (req, res) => {
    const result = await rentalServices.returnRental(req.params.id, req.body);
    return sendResponse(res, result);
};

export const cancelRentalController = async (req, res) => {
    const result = await rentalServices.cancelRental(req.params.id);
    return sendResponse(res, result);
};

export const getRentalsByStatusController = async (req, res) => {
    const result = await rentalServices.getRentalsByStatus(req.params.status);
    return sendResponse(res, result);
};
