import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { categoryController } from "../controllers/category.controller";

const router = Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    categoryController.createCategory
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    categoryController.getCategoryById
);

router.patch(
    "/:id/deactivate",
    authMiddleware,
    roleMiddleware("ADMIN"),
    categoryController.deactivateCategory
);

router.patch(
    "/:id/activate",
    authMiddleware,
    roleMiddleware("ADMIN"),
    categoryController.activateCategory
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    categoryController.getCategories
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    categoryController.updateCategory
);


export default router;