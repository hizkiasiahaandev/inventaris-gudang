import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { StatusCodes } from "http-status-codes";
import type { Role } from "../../generated/prisma/enums";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized",
            })
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET) as {
            userId: number,
            role: Role
        };

        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };

        next();
    } catch {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Invalid or expired token",
        });
    };
};