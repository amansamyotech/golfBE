import * as reportService from '../Services/ReportService.js';
import { sendResponse } from "../helper/responseHelper.js";

export const generateMonthlySalesController = async (req, res) => {
    const result = await reportService.getMonthlySalesReport();
    return sendResponse(res, result);
}

export const getDailySummaryController = async (req, res) => {
    const { startDate, endDate } = req.query;
    const result = await reportService.getDailySummaryReport(startDate, endDate);
    return sendResponse(res, result);
};

export const getDailySalesReportOfRentalController = async (req, res) => {
    const result = await reportService.getDailySalesReportOfRental();
    return sendResponse(res, result);
}

export const getMonthlySalesReportOfRentalController = async (req, res) => {
    const result = await reportService.getMonthlySalesReportOfRental();
    return sendResponse(res, result);
}

