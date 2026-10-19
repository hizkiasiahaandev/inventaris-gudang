import type { Request, Response } from "express";
import { dashboardSummaryService } from "../service/summary.service";
import { StatusCodes } from "http-status-codes";

export const dashboardSummaryController = {
    async getSummaryController(
        _req: Request,
        res: Response
    ) {
        try {
            const summaryCard = await dashboardSummaryService.getSummary();
            res.status(StatusCodes.OK).json({
                success: true,
                message: "Dashboard summary successfully retrieved",
                data: summaryCard
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to retrieve dashboard summary",
            });
        };
    },
};