import express from "express";
import { generateMonthlySalesController, getDailySummaryController, getDailySalesReportOfRentalController, getMonthlySalesReportOfRentalController } from "../Controllers/ReportController.js";

const reportRouter = express.Router();
reportRouter.get("/monthly-sales", generateMonthlySalesController);
reportRouter.get("/daily-sales", getDailySummaryController);

reportRouter.get("/daily-sales-rental", getDailySalesReportOfRentalController);
reportRouter.get("/monthly-sales-rental", getMonthlySalesReportOfRentalController);

export default reportRouter;
