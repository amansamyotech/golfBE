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
import rentalRouter from "../Routes/RentalRoute.js";

export const createRental = async (data) => {
    try {

        const product = await ProductModel.findById(data.productId);
        if (!product) {
            return createResponse(statusCodes.NOT_FOUND, "Product not found");
        }

        const availableStock = product.totalStock - product.rentedOut;
        if (availableStock < data.quantity) {
            return createResponse(statusCodes.BAD_REQUEST, "Insufficient stock for rental");
        }

        product.rentedOut += data.quantity;
        product.stock = product.totalStock - product.rentedOut;
        await product.save();

        const newRental = new RentalModel({
            ...data,
            totalAmount: data.totalAmount,
        });
        const saved = await newRental.save();
        return createResponse(statusCodes.CREATED, AddedsuccessMessages.RENTAL, saved);
    } catch (err) {
        console.error("Error creating rental:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
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

export const returnRental = async (id, data) => {
    try {
        const rental = await RentalModel.findById(id);
        if (!rental) {
            return createResponse(statusCodes.NOT_FOUND, notFound.RENTAL);
        }

        if (rental.status !== "returned") {
            const product = await ProductModel.findById(rental.productId);
            if (product) {
                product.stock += rental.quantity;
                product.rentedOut -= rental.quantity;
                await product.save();
            }
        }

        const updatedData = { ...data, status: "returned" };
        const updated = await RentalModel.findByIdAndUpdate(id, updatedData, { new: true });

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

export const updateRental = async (id, data) => {
    try {
        const existing = await RentalModel.findById(id);
        if (!existing) {
            return createResponse(statusCodes.NOT_FOUND, "Rental not found");
        }

        const oldProduct = await ProductModel.findById(existing.productId);
        if (!oldProduct) {
            return createResponse(statusCodes.NOT_FOUND, "Product not found");
        }

        const newProduct = await ProductModel.findById(data.productId);
        if (!newProduct) {
            return createResponse(statusCodes.NOT_FOUND, "Product not found");
        }

        const oldQty = existing.quantity;
        const newQty = data.quantity;

        // ✅ Product changed
        if (existing.productId.toString() !== data.productId.toString()) {

            // Return old qty to previous product
            oldProduct.rentedOut -= oldQty;
            oldProduct.stock = oldProduct.totalStock - oldProduct.rentedOut;
            await oldProduct.save();

            // Check if new product has enough stock
            const availableStock = newProduct.totalStock - newProduct.rentedOut;
            if (availableStock < newQty) {
                return createResponse(statusCodes.BAD_REQUEST, "Insufficient stock for new product");
            }

            // Deduct new qty
            newProduct.rentedOut += newQty;
            newProduct.stock = newProduct.totalStock - newProduct.rentedOut;
            await newProduct.save();

        } else {
            // ✅ Same product, only quantity changed
            const qtyDifference = newQty - oldQty;  // +increase, -decrease

            if (qtyDifference > 0) {
                // check stock for additional qty
                const availableStock = oldProduct.totalStock - oldProduct.rentedOut;
                if (availableStock < qtyDifference) {
                    return createResponse(statusCodes.BAD_REQUEST, "Insufficient stock to increase quantity");
                }
                oldProduct.rentedOut += qtyDifference;
            } else if (qtyDifference < 0) {
                // reduce rentedOut for returned qty
                oldProduct.rentedOut += qtyDifference;
            }

            oldProduct.stock = oldProduct.totalStock - oldProduct.rentedOut;
            await oldProduct.save();
        }

        // ✅ Update rental entry
        existing.productId = data.productId;
        existing.customerId = data.customerId;
        existing.quantity = newQty;
        existing.rentedDate = data.rentedDate;
        existing.returnDate = data.returnDate;
        existing.totalAmount = data.totalAmount;
        existing.notes = data.notes;
        if (data.status) existing.status = data.status;

        const updated = await existing.save();
        return createResponse(statusCodes.OK, "Rental updated successfully", updated);

    } catch (err) {
        console.error("Error updating rental:", err);
        return createResponse(statusCodes.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};





