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
            required: true, // e.g. "Balls", "Clubs", "Apparel", "Cart"
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
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        rentalRate: {
            type: Number,
            default: 0, // price per day/hour for rentals
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
