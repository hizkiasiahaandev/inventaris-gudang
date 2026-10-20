import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { supplierController } from "../controllers/supplier.controller";

const router = Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    supplierController.createSupplier
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    supplierController.getSupplierById
);


router.patch(
    "/:id/deactivate",
    authMiddleware,
    roleMiddleware("ADMIN"),
    supplierController.deactivateSupplier
);

router.patch(
    "/:id/activate",
    authMiddleware,
    roleMiddleware("ADMIN"),
    supplierController.activateSupplier
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    supplierController.getSuppliers
);

router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    supplierController.updateSupplier
);




export default router;