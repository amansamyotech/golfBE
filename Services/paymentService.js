import PaymentModel from "../Modals/paymentModal.js";
import CustomerModel from "../Modals/CustomerModal.js";
import BookingModel from "../Modals/GuestBookingModal.js";

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

// Create Payment
export const createPayment = async (data) => {
    try {

        const customer = await CustomerModel.findById(data.customerId);

        if (!customer) {
            return createResponse(statusCodes.BAD_REQUEST, notFound.CUSTOMER);
        }

        const bookingId = data.bookingId;

        if (bookingId) {
            const booking = await BookingModel.findById(bookingId);
            if (!booking) {
                return createResponse(statusCodes.BAD_REQUEST, notFound.BOOKING);
            }

            // if (customer.role === 'guest') {
            // booking.bookingStatus = 'completed';
            booking.paymentStatus = 'paid';
            await booking.save();
            // }
        }


        const newPayment = new PaymentModel(data);
        const saved = await newPayment.save();


        return createResponse(
            statusCodes.CREATED,
            AddedsuccessMessages.PAYMENT,
            { payment: saved }
        );

    } catch (err) {
        console.log(err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};


//Get All Payments
export const getPayments = async () => {
    try {
        const payments = await PaymentModel.find({ isDeleted: false })
            .populate("customerId")
            .populate("bookingId");
        return createResponse(statusCodes.OK, null, payments);

    } catch (error) {
        console.log(error);
        return createResponse(statusCodes.INTERNAL_SERVER_ERROR, errorMessages.INTERNAL_SERVER_ERROR);
    }
};


// Get Single Payment by ID
export const getPaymentById = async (id) => {
    try {
        const payment = await PaymentModel.findOne({ _id: id, isDeleted: false })
            // .populate("customerId")
            // .populate("bookingId");
            .populate("customerId")
            .populate({
                path: "bookingId",
                populate: [
                    { path: "course", model: "Course" },
                    { path: "slotIds", model: "IndividualSlot" },
                    { path: "caddyId", model: "employee" }
                ]
            });

        if (!payment) {
            return createResponse(statusCodes.NOT_FOUND, notFound.PAYMENT);
        }

        return createResponse(
            statusCodes.SUCCESS,
            null,
            payment
        );

    } catch (error) {
        console.log(error);
        return createResponse(statusCodes.INTERNAL_SERVER_ERROR, errorMessages.INTERNAL_SERVER_ERROR);
    }
};


// Update Payment
export const updatePayment = async (id, data) => {
    try {
        const payment = await PaymentModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            data,
            { new: true }
        );

        if (!payment) {
            return createResponse(statusCodes.NOT_FOUND, notFound.PAYMENT);
        }

        return createResponse(
            statusCodes.SUCCESS,
            UpdatedsuccessMessages.PAYMENT,
            { payment }
        );

    } catch (error) {
        console.log(error);
        return createResponse(statusCodes.INTERNAL_SERVER_ERROR, errorMessages.INTERNAL_SERVER_ERROR);
    }
};


// Delete Payment (Soft Delete)
export const deletePayment = async (id) => {
    try {
        const payment = await PaymentModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!payment) {
            return createResponse(statusCodes.NOT_FOUND, notFound.PAYMENT);
        }

        return createResponse(
            statusCodes.SUCCESS,
            DeletedsuccessMessages.PAYMENT
        );

    } catch (error) {
        console.log(error);
        return createResponse(statusCodes.INTERNAL_SERVER_ERROR, errorMessages.INTERNAL_SERVER_ERROR);
    }
};



