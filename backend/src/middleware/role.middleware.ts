import type { NextFunction, Request, Response } from "express";
import type { Role } from "../../generated/prisma/enums";
import { StatusCodes } from "http-status-codes";

export const roleMiddleware = (...allowedRoles: Role[]) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        if (!req.user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (!allowedRoles.includes(req.user?.role)) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: "Forbidden"
            });
        }
        next();
    };
};
