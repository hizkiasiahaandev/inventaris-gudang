import { Router } from "express";
import { userController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

router.post(
    "/login",
    userController.loginController,
);

router.post(
    "/register",
    authMiddleware,
    roleMiddleware("ADMIN"),
    userController.registerByAdminController,
);


router.get(
    "/me",
    authMiddleware,
    roleMiddleware("ADMIN", "STAFF"),
    userController.getMe,
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    userController.getUserById
);


router.patch(
    "/:id/deactivate",
    authMiddleware,
    roleMiddleware("ADMIN"),
    userController.deactivateUser
);

router.patch(
    "/:id/activate",
    authMiddleware,
    roleMiddleware("ADMIN"),
    userController.activateUser
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    userController.getUsers,
);

router.patch(
    "/change-password",
    authMiddleware,
    userController.changePassword
);

router.post(
    "/logout",
    authMiddleware,
    userController.logout   
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    userController.updateUser,
);



export default router;
