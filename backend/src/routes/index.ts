import { Router } from "express";
import userRoutes from "./user.routes";
import supplierRoutes from "./supplier.routes";
import categoryRoutes from "./category.routes";
import itemRoutes from "./item.routes";
import companyProfileRoutes from "./company.routes";
import stockMovementRoutes from "./stock.routes";
import summaryRoutes from "./summary.routes";

const router = Router();

router.use("/auth", userRoutes);
router.use("/supplier", supplierRoutes);
router.use("/category", categoryRoutes);
router.use("/item", itemRoutes);
router.use("/company", companyProfileRoutes);
router.use("/stock", stockMovementRoutes);
router.use("/dashboard", summaryRoutes)

export default router;