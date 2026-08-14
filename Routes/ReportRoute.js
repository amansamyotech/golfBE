import express from "express";
import {
  generateMonthlySalesController,
  getDailySummaryController,
  getDailySalesReportOfRentalController,
  getMonthlySalesReportOfRentalController,
} from "../Controllers/ReportController.js";
import { verifyToken, authorizeRoles, ROLES } from "../helper/Auth.js";

const reportRouter = express.Router();
reportRouter.use(verifyToken);

reportRouter.get("/daily-sales", authorizeRoles(...ROLES.OPERATIONS), getDailySummaryController);
reportRouter.get("/monthly-sales", authorizeRoles(...ROLES.MANAGEMENT), generateMonthlySalesController);
reportRouter.get("/daily-sales-rental", authorizeRoles(...ROLES.MANAGEMENT), getDailySalesReportOfRentalController);
reportRouter.get("/monthly-sales-rental", authorizeRoles(...ROLES.MANAGEMENT), getMonthlySalesReportOfRentalController);

export default reportRouter;
