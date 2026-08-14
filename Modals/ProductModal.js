import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        costPrice: {
            type: Number,
            default: 0,
        },
        totalStock: {
            type: Number,
            required: true,
            default: 0, // total purchased
        },
        rentedOut: {
            type: Number,
            default: 0,
        },
        stock: {
            type: Number,
            required: true,
            default: function () {
                return this.totalStock;
            },
        },
        rentalRate: {
            type: Number,
            default: 0,
        },
        productImage: {
            type: String,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    { timestamps: true }
);

const ProductModel = mongoose.model("Product", ProductSchema);
export default ProductModel;
