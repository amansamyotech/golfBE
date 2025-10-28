import RentalModel from "../Modals/RentalModal.js";
import ProductModel from "../Modals/ProductModal.js";
import {
    AddedFailedMessages,
    AddedsuccessMessages,
    UpdatedsuccessMessages,
    notFound,
    DeletedsuccessMessages,
    requiredMessage,
    errorMessages,
    commonMessage,
} from "../Core/messages.js";
import { statusCodes } from "../Core/constant.js";
import { createResponse } from "../helper/responseHelper.js";

export const createRental = async (data) => {
    try {
        const product = await ProductModel.findById(data.productId);
        if (!product) {
            return createResponse(statusCodes.NOT_FOUND, "Product not found");
        }

        if (product.stock < data.quantity) {
            return createResponse(statusCodes.BAD_REQUEST, "Insufficient stock for rental");
        }

        // Reduce stock temporarily
        product.stock -= data.quantity;
        await product.save();

        // Calculate total amount
        const totalAmount = product.rentalRate * data.quantity;

        const newRental = new RentalModel({
            ...data,
            totalAmount,
        });

        const saved = await newRental.save();
        return createResponse(statusCodes.CREATED, AddedsuccessMessages.RENTAL, saved);

    } catch (err) {
        console.error("Error creating rental:", err);
        return createResponse(statusCodes.INTERNAL_SERVER_ERROR, errorMessages.INTERNAL_SERVER_ERROR);
    }
};

export const getAllRentals = async () => {
    try {
        const rentals = await RentalModel.find()
            .populate("productId", "name category rentalRate")
            .populate("customerId", "name phone email")
            .sort({ createdAt: -1 });

        return createResponse(statusCodes.OK, commonMessage.SUCCESS, rentals);
    } catch (err) {
        console.error("Error fetching rentals:", err);
        return createResponse(statusCodes.INTERNAL_SERVER_ERROR, errorMessages.INTERNAL_SERVER_ERROR);
    }
};

export const getRentalById = async (id) => {
    try {
        const rental = await RentalModel.findById(id)
            .populate("productId", "name category rentalRate")
            .populate("customerId", "name phone email");

        if (!rental) {
            return createResponse(statusCodes.NOT_FOUND, notFound.RENTAL);
        }

        return createResponse(statusCodes.OK, commonMessage.SUCCESS, rental);
    } catch (err) {
        console.error("Error fetching rental by ID:", err);
        return createResponse(statusCodes.INTERNAL_SERVER_ERROR, errorMessages.INTERNAL_SERVER_ERROR);
    }
};

export const updateRental = async (id, data) => {
    try {
        const rental = await RentalModel.findById(id);
        if (!rental) {
            return createResponse(statusCodes.NOT_FOUND, notFound.RENTAL);
        }

        if (data.status === "returned" && rental.status !== "returned") {
            const product = await ProductModel.findById(rental.productId);
            if (product) {
                product.stock += rental.quantity;
                await product.save();
            }
        }

        const updated = await RentalModel.findByIdAndUpdate(id, data, { new: true });
        return createResponse(statusCodes.OK, UpdatedsuccessMessages.RENTAL, updated);
    } catch (err) {
        console.error("Error updating rental:", err);
        return createResponse(statusCodes.INTERNAL_SERVER_ERROR, errorMessages.INTERNAL_SERVER_ERROR);
    }
};

export const cancelRental = async (id) => {
    try {
        const rental = await RentalModel.findById(id);
        if (!rental) {
            return createResponse(statusCodes.NOT_FOUND, "Rental not found");
        }

        if (rental.status === "returned") {
            return createResponse(statusCodes.BAD_REQUEST, "Cannot cancel a returned rental");
        }
        if (rental.status === "cancelled") {
            return createResponse(statusCodes.BAD_REQUEST, "Rental is already cancelled");
        }

        const product = await ProductModel.findById(rental.productId);
        if (product) {
            product.stock += rental.quantity;
            await product.save();
        }

        rental.status = "cancelled";
        await rental.save();

        return createResponse(statusCodes.OK, "Rental cancelled successfully", rental);
    } catch (err) {
        console.error("Error cancelling rental:", err);
        return createResponse(statusCodes.INTERNAL_SERVER_ERROR, errorMessages.INTERNAL_SERVER_ERROR);
    }
};

export const getRentalsByStatus = async (status) => {
    try {
        const rentals = await RentalModel.find({ status })
            .populate("productId", "name category rentalRate")
            .populate("customerId", "name phone email");

        return createResponse(statusCodes.OK, `Rentals with status: ${status}`, rentals);
    } catch (err) {
        console.error("Error fetching rentals by status:", err);
        return createResponse(statusCodes.INTERNAL_SERVER_ERROR, errorMessages.INTERNAL_SERVER_ERROR);
    }
};

