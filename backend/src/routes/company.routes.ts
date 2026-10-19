import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { CompanyProfileController } from "../controllers/company.controller";

const router = Router();

router.get(
    "/",
    CompanyProfileController.getCompanyProfile
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    CompanyProfileController.createCompany
);

router.patch(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    CompanyProfileController.updateCompanyProfile
);



export default router;