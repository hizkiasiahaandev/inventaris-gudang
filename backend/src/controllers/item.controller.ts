import type { Request, Response } from "express";
import { itemService } from "../service/item.service";
import { StatusCodes } from "http-status-codes";

export const itemController = {
    async createItem(
        req: Request,
        res: Response
    ) {
        try {
            const {
                sku,
                name,
                stock,
                minimumStock,
                unit,
                purchasePrice,
                categoryId,
                supplierId,
                description,
            } = req.body;

            const createdById= Number(req.user?.userId);

            const item = await itemService.createItem(
                sku,
                name,
                stock,
                minimumStock,
                unit,
                purchasePrice,
                categoryId,
                supplierId,
                createdById,
                description,
            );

            res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Item successfully created",
                data: item
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Item failed to create",
            });
        };
    },

    async deactivateItem(
        req: Request,
        res: Response
    ) {
        try {
            const id = Number(req.params.id);

            const item = await itemService.deactivate(id);

            res.status(StatusCodes.OK).json({
                success: true,
                message: "Item successfully deactivated",
                data: item
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Item Failed to deactivated"
            });
        };
    },

    async activateItem(
        req: Request,
        res: Response
    ) {
        try {
            const id = Number(req.params.id);

            const item = await itemService.activate(id);

            res.status(StatusCodes.OK).json({
                success: true,
                message: "Item successfully to activated",
                data: item
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to activated",
            });
        };
    },

    async getItems(
        req: Request,
        res: Response
    ) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const search =
                typeof req.query.search === "string"
                    ? req.query.search
                    : undefined

            const isActive =
                req.query.isActive !== undefined
                    ? req.query.isActive === "true"
                    : undefined

            const result = await itemService.getItems(
                page,
                limit,
                search,
                isActive
            );

            res.status(StatusCodes.OK).json({
                success: true,
                message: "Items successfully retrieved",
                data: result
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to retrieve item",
            });
        };
    },

    async updateItem(
        req: Request,
        res: Response
    ) {
        try {

            const id = Number(req.params.id);
            const updatedById = Number(req.user?.userId);

            const {
                sku,
                name,
                minimumStock,
                unit,
                purchasePrice,
                categoryId,
                supplierId,
                description,
            } = req.body;

            const item = await itemService.updateItem(
                id,
                sku,
                name,
                minimumStock,
                unit,
                purchasePrice,
                categoryId,
                supplierId,
                updatedById,
                description,
            );

            console.log(item);

            res.status(StatusCodes.OK).json({
                success: true,
                message: "Item successfully updated.",
                data: item
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to updated.",
            });
        };
    },

    async getItemById(
        req: Request,
        res: Response
    ) {
        try {
            const id = Number(req.params.id);

            const item = await itemService.getItemById(id);

            res.status(StatusCodes.OK).json({
                success: true,
                message: "Item successfully retrieved.",
                data: item,
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to get item."
            });
        };
    },
};