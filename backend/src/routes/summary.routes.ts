import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { dashboardSummaryController } from "../controllers/summary.controller";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

router.get(
    "/summary",
    authMiddleware,
    roleMiddleware("ADMIN", "STAFF"),
    dashboardSummaryController.getSummaryController
);


export default router;