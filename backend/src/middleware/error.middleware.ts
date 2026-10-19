import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const errorMiddleware = (
    _err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
    });
};