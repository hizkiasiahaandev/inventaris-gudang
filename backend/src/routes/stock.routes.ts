import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { stockController } from "../controllers/stock.controller";

const router = Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN", "STAFF"),
    stockController.createStockMovement
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN", "STAFF"),
    stockController.getStockMovemnts
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN", "STAFF"),
    stockController.getStockMovementsById
);

router.patch(
    "/:id/cancel",
    authMiddleware,
    roleMiddleware("ADMIN", "STAFF"),
    stockController.cancelStockMovement
);



export default router;