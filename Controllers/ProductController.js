import { constant } from "../Core/constant.js";
import * as productService from "../Services/ProductService.js";
import { sendResponse } from "../helper/responseHelper.js";

export const createProductController = async (req, res) => {
    const { name, category, price, costPrice, stock, rentalRate, description } = req.body;
    const data = {
        name, category, price, costPrice, stock, rentalRate, description
    }

    if (req.files && req.files.productImage && req.files.productImage[0]) {
        data.productImage = `/images/${req.files.productImage[0].filename}`;
    }
    const result = await productService.createProduct(data);
    return sendResponse(res, result);
};

export const getAllProductsController = async (req, res) => {
    const result = await productService.getAllProducts();
    return sendResponse(res, result);
};

export const getProductByIdController = async (req, res) => {
    const result = await productService.getProductById(req.params.id);
    return sendResponse(res, result);
};

export const updateProductController = async (req, res) => {

    const { name, category, price, costPrice, stock, rentalRate, description } = req.body;
    const data = {
        name, category, price, costPrice, stock, rentalRate, description
    }

    if (req.files && req.files.productImage && req.files.productImage[0]) {
        data.productImage = `/images/${req.files.productImage[0].filename}`;
    }

    const result = await productService.updateProduct(req.params.id, data);
    return sendResponse(res, result);
};

export const updateStockController = async (req, res) => {
    const { stock } = req.body;
    const result = await productService.updateStock(req.params.id, stock);
    return sendResponse(res, result);
};

export const deleteProductController = async (req, res) => {
    const result = await productService.deleteProduct(req.params.id);
    return sendResponse(res, result);
};