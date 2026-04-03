import { Router } from "express";
import { Role } from "../../../generated/prisma/client.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as dashboardService from "./dashboard.service.js";

const router = Router();
router.use(authenticate);

// All roles can see basic summary
router.get(
  "/summary",
  authorize(Role.VIEWER),
  asyncHandler(async (req, res) => {
    const data = await dashboardService.getSummary();
    res.json(new ApiResponse(data, "Dashboard summary"));
  }),
);

// Only ANALYST and ADMIN can see detailed analytics
router.get(
  "/analytics",
  authorize(Role.ANALYST),
  asyncHandler(async (req, res) => {
    const [categories, trends] = await Promise.all([
      dashboardService.getCategoryBreakdown(),
      dashboardService.getMonthlyTrends(),
    ]);
    res.json(new ApiResponse({ categories, trends }, "Analytics data"));
  }),
);

// All roles can see recent activity
router.get(
  "/recent",
  authorize(Role.VIEWER),
  asyncHandler(async (req, res) => {
    const data = await dashboardService.getRecentActivity();
    res.json(new ApiResponse(data, "Recent activity"));
  }),
);

export default router;
