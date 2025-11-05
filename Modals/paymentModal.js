import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    totalAmount: { type: Number },
    paidAmount: { type: Number, },
    pendingAmount: { type: Number },
    discount: { type: Number, default: 0 },
    paymentMode: { type: String, enum: ["cash", "card", "online", "upi"], required: true },
    status: { type: String, enum: ["success", "pending", "failed"], default: "success" },
    notes: { type: String },

    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const PaymentModel = mongoose.model("Payment", paymentSchema);
export default PaymentModel;
