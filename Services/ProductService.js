import ProductModel from "../Modals/ProductModal.js";
import {
    AddedFailedMessages,
    AddedsuccessMessages,
    UpdatedsuccessMessages,
    notFound,
    DeletedsuccessMessages,
    requiredMessage,
    errorMessages,
} from "../Core/messages.js";
import { statusCodes } from "../Core/constant.js";
import { createResponse } from "../helper/responseHelper.js";
import { commonMessage } from "../Core/messages.js";

export const createProduct = async (data) => {
    try {
        const newProduct = new ProductModel(data);
        const saved = await newProduct.save();
        return createResponse(
            statusCodes.CREATED,
            AddedsuccessMessages.PRODUCT_ADDED,
            saved
        );
    } catch (err) {
        console.error("Create Product Error:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const getAllProducts = async () => {
    try {
        const products = await ProductModel.find();
        return createResponse(
            statusCodes.OK,
            commonMessage.SUCCESS,
            products
        );
    } catch (err) {
        console.error("Get All Products Error:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const getProductById = async (id) => {
    try {
        const product = await ProductModel.findById(id);
        if (!product) {
            return createResponse(statusCodes.NOT_FOUND, errorMessages.NOT_FOUND);
        }
        return createResponse(
            statusCodes.OK,
            commonMessage.SUCCESS,
            product
        );
    } catch (err) {
        console.error("Get Product Error:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const updateProduct = async (id, data) => {
    try {
        const updated = await ProductModel.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!updated) {
            return createResponse(statusCodes.NOT_FOUND, errorMessages.NOT_FOUND);
        }
        return createResponse(
            statusCodes.OK,
            UpdatedsuccessMessages.PRODUCT,
            updated
        );
    } catch (err) {
        console.error("Update Product Error:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const updateStock = async (id, stock) => {
    try {
        const updated = await ProductModel.findByIdAndUpdate(
            id,
            { stock },
            { new: true }
        );
        if (!updated) {
            return createResponse(statusCodes.NOT_FOUND, errorMessages.NOT_FOUND);
        }
        return createResponse(
            statusCodes.OK,
            UpdatedsuccessMessages.STOCK_UPDATED,
            updated
        );
    } catch (err) {
        console.error("Update Stock Error:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const deleteProduct = async (id) => {
    try {
        const deleted = await ProductModel.findByIdAndDelete(id);
        if (!deleted) {
            return createResponse(statusCodes.NOT_FOUND, errorMessages.NOT_FOUND);
        }
        return createResponse(
            statusCodes.OK,
            DeletedsuccessMessages.PRODUCT,
            deleted
        );
    } catch (err) {
        console.error("Delete Product Error:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};