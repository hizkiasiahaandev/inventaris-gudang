import type { Request, Response } from "express";
import { stockService } from "../service/stock.service";
import { StatusCodes } from "http-status-codes";
import { StockMovementStatus, StockMovementType } from "../../generated/prisma/enums";

export const stockController = {
    async createStockMovement(
        req: Request,
        res: Response
    ) {
        try {
            const { itemId, type, quantity, note } = req.body;
            const createdById = Number(req.user?.userId);

            const stock = await stockService.createStockMovement(
                Number(itemId),
                type,
                Number(quantity),
                createdById,
                note
            );

            res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Stockmovement successfully created",
                data: stock
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to create stockmovement",
            });
        };
    },

    async getStockMovemnts(
        req: Request,
        res: Response
    ) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const type = req.query.type as StockMovementType | undefined;
            const status = req.query.status as StockMovementStatus | undefined;
            const itemId = req.query.itemId
                ? Number(req.query.itemId)
                : undefined

            const result = await stockService.getStockMovemnts(
                page,
                limit,
                type,
                status,
                itemId
            );

            res.status(StatusCodes.OK).json({
                success: true,
                message: "Stock movements successfully retrieved",
                data: result
            });

        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to retrieve stock movements",
            });
        };
    },

    async getStockMovementsById(
        req: Request,
        res: Response
    ) {
        try {
            const id = Number(req.params.id);
            const stock = await stockService.getStockMovementsById(
                id,
            );
            res.status(StatusCodes.OK).json({
                success: true,
                message: "Stock movements successfully retrieved",
                data: stock
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to retrieved stock movements"
            });
        };
    },

    async cancelStockMovement(
        req: Request,
        res: Response
    ) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                throw new Error("Invalid stock movement ID");
            }

            const result = await stockService.cancelStockMovement(id);

            res.status(StatusCodes.OK).json({
                success: true,
                message: "Stock movement successfully cancelled",
                data: result
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to cancel stock movement",
            });
        };
    },
};

