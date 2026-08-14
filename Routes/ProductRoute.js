import express from "express";
import {
    createProductController,
    getAllProductsController,
    getProductByIdController,
    updateProductController,
    updateStockController,
    deleteProductController,
} from "../Controllers/ProductController.js";
import fileHandler from "../middleware/FileHandler.js";
import { verifyToken, authorizeRoles, ROLES } from "../helper/Auth.js";

const productRouter = express.Router();

productRouter.use(verifyToken);
productRouter.use(authorizeRoles(...ROLES.OPERATIONS));

productRouter.post("/create", fileHandler(), createProductController);
productRouter.get("/", getAllProductsController);
productRouter.get("/:id", getProductByIdController);
productRouter.put("/update/:id", fileHandler(), updateProductController);
productRouter.put("/update-stock/:id", updateStockController);
productRouter.delete("/delete/:id", deleteProductController);

export default productRouter;
