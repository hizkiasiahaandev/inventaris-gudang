import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { itemController } from "../controllers/item.controller";

const router = Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    itemController.createItem
);

router.patch(
    "/:id/deactivate",
    authMiddleware,
    roleMiddleware("ADMIN"),
    itemController.deactivateItem
);

router.patch(
    "/:id/activate",
    authMiddleware,
    roleMiddleware("ADMIN"),
    itemController.activateItem
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN", "STAFF"),
    itemController.getItems
);

export default router;