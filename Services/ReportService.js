import {
    AddedFailedMessages,
    AddedsuccessMessages,
    UpdatedsuccessMessages,
    DeletedsuccessMessages,
    requiredMessage,
    errorMessages,
    commonMessage,
    notFound,
} from "../Core/messages.js";
import { statusCodes } from "../Core/constant.js";
import { createResponse } from "../helper/responseHelper.js";
import BookingModel from "../Modals/GuestBookingModal.js";
import PaymentModel from "../Modals/paymentModal.js";
import RentalModel from "../Modals/RentalModal.js";


// CREATE SALES REPORT
export const getMonthlySalesReport = async () => {
    try {
        const monthlySales = await PaymentModel.aggregate([
            {
                $match: {
                    isDeleted: false,
                    status: "success", // Only successful payments count toward sales
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    totalSales: { $sum: "$paidAmount" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        const result = months.map((name, index) => {
            const monthData = monthlySales.find((m) => m._id.month === index + 1);
            return {
                month: name,
                totalSales: monthData ? monthData.totalSales : 0,
            };
        });
        return createResponse(statusCodes.OK, null, result);
    } catch (error) {
        console.error("Error generating monthly sales report:", error);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

// 🧾 Daily Summary (Filter by Date Range)
export const getDailySummaryReport = async (startDate, endDate) => {
    try {
        const matchStage = {
            isDeleted: false,
            status: "success",
        };

        if (startDate && endDate) {
            matchStage.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const summary = await PaymentModel.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                    },
                    totalSales: { $sum: "$paidAmount" },
                    totalDiscount: { $sum: "$discount" },
                    totalTransactions: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } },
        ]);

        const result = summary.map((item) => ({
            date: `${String(item._id.day).padStart(2, "0")}-${String(item._id.month).padStart(2, "0")}-${item._id.year}`,
            totalSales: item.totalSales || 0,
            totalDiscount: item.totalDiscount || 0,
            totalTransactions: item.totalTransactions || 0,
        }));

        return createResponse(statusCodes.OK, null, result);
    } catch (error) {
        console.error("Error generating daily summary:", error);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

// Utility function to get start and end of day/month
const getDateRange = (type) => {
    const now = new Date();
    let start, end;

    if (type === "day") {
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
    } else if (type === "month") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    return { start, end };
};

const generateSalesReport = async (startDate, endDate) => {
    const report = await RentalModel.aggregate([
        {
            $match: {
                // rentedDate: { $gte: startDate, $lte: endDate },
                status: { $in: ["rented", "returned"] },
            },
        },
        {
            $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "product",
            },
        },
        { $unwind: "$product" },
        {
            $group: {
                _id: "$productId",
                productName: { $first: "$product.name" },
                category: { $first: "$product.category" },
                totalQuantity: { $sum: "$quantity" },
                totalRevenue: { $sum: "$totalAmount" },
                totalDiscount: { $sum: "$discount" },
                netRevenue: { $sum: { $subtract: ["$totalAmount", "$discount"] } },
            },
        },
        { $sort: { totalRevenue: -1 } },
    ]);

    // optional: calculate totals summary
    const summary = report.reduce(
        (acc, cur) => {
            acc.totalRevenue += cur.totalRevenue;
            acc.totalDiscount += cur.totalDiscount;
            acc.netRevenue += cur.netRevenue;
            acc.totalQuantity += cur.totalQuantity;
            return acc;
        },
        { totalRevenue: 0, totalDiscount: 0, netRevenue: 0, totalQuantity: 0 }
    );

    return { summary, details: report };
};

export const getDailySalesReportOfRental = async () => {
    try {
        const { start, end } = getDateRange("day");
        const data = await generateSalesReport(start, end);
        return createResponse(statusCodes.OK, null, data);
    } catch (err) {
        console.error("Error while making payment for rental:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

const generateMonthlySalesSummary = async () => {
    const report = await RentalModel.aggregate([
        {
            $match: {
                status: { $in: ["rented", "returned"] },
            },
        },
        {
            $addFields: {
                month: { $month: "$rentedDate" },
                year: { $year: "$rentedDate" },
            },
        },
        {
            $group: {
                _id: { year: "$year", month: "$month" },
                totalQuantity: { $sum: "$quantity" },
                totalRevenue: { $sum: "$totalAmount" },
                totalDiscount: { $sum: "$discount" },
                netRevenue: {
                    $sum: { $subtract: ["$totalAmount", "$discount"] },
                },
            },
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1 },
        },
        {
            // Optional: rename _id fields for cleaner response
            $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                totalQuantity: 1,
                totalRevenue: 1,
                totalDiscount: 1,
                netRevenue: 1,
            },
        },
    ]);

    return report;
};

export const getMonthlySalesReportOfRental = async () => {
    try {

        const data = await generateMonthlySalesSummary();
        return createResponse(statusCodes.OK, null, data);
    } catch (err) {
        console.error("Error while making payment for rental:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,

            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

