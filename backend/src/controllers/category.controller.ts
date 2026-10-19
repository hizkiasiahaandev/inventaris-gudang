import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { categoryService } from "../service/category.service";

export const categoryController = {
    async createCategory(
        req: Request,
        res: Response
    ) {
        try {
            const { name, description } = req.body
            const result = await categoryService.createCategory(
                name,
                description
            );
            res.status(StatusCodes.OK).json({
                success: true,
                message: "category successfully created",
                data: result
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "category failed to create",
            });
        };
    },

    async deactivateCategory(
        req: Request,
        res: Response
    ) {
        try {
            const id = Number(req.params.id);

            const result = await categoryService.deactivateCategory(id);
            res.status(StatusCodes.OK).json({
                success: true,
                message: "Category successfully deactivated",
                data: result
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Category failed to deactivate"
            });
        };
    },

    async activateCategory(
        req: Request,
        res: Response
    ) {
        try {
            const id = Number(req.params.id);

            const category = await categoryService.activateCategory(id);

            res.status(StatusCodes.OK).json({
                success: true,
                message: "Category successfully activated",
                data: category
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Category failed to activate",
            });
        };
    },

    async getCategories(
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

            const result = await categoryService.getCategories(
                page,
                limit,
                search,
                isActive
            );

            res.status(StatusCodes.OK).json({
                success: true,
                message: "Category successfully retrieved",
                data: result
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Category failed to retrieve"
            });
        };
    },

    async updateCategory(
        req: Request,
        res: Response
    ) {
        try {
            const id = Number(req.params.id);
            const { name, description } = req.body;

            const category = await categoryService.updateCategory(
                id,
                name,
                description
            );

            res.status(StatusCodes.OK).json({
                success: true,
                message: "Category successfully updated",
                data: category
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to update",
            });
        };
    },

    async getCategoryById(
        req: Request,
        res: Response
    ) {
        try {
            const id = Number(req.params.id);

            const category = await categoryService.getCategoryById(id);
            res.status(StatusCodes.OK).json({
                success: true,
                message: "Category successfully retrieved",
                data: category
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to retrieve category"
            });
        };
    },
}