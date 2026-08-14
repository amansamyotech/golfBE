import mongoose from "mongoose";

const RentalSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
        rentedDate: {
            type: Date,
            required: true,
        },
        returnDate: {
            type: Date,
        },
        totalAmount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["rented", "returned", "cancelled"],
            default: "rented",
        },
        notes: {
            type: String,
            trim: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "overdue"],
            default: "pending",
        },
        paidAmount: {
            type: Number,
            default: 0,
        },
        discount: {
            type: Number,
            default: 0,
        },
        paymentMode: { type: String, enum: ["cash", "card", "online", "upi"]},
    },
    { timestamps: true }
);

const RentalModel = mongoose.model("Rental", RentalSchema);
export default RentalModel;
