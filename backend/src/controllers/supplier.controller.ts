import type { Request, Response } from "express";
import { supplierService } from "../service/supplier.service";
import { StatusCodes } from "http-status-codes";

export const supplierController = {
    async createSupplier(
        req: Request,
        res: Response
    ) {
        try {
            const supplier = await supplierService.createSupplier(req.body);
            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Supplier successfully created",
                data: supplier
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Supplier failed to create",
            });
        };
    },

    async deactivateSupplier(
        req: Request,
        res: Response
    ) {
        try {
            const id = Number(req.params.id);

            const supplier = await supplierService.deactivateSupplier(id);
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "supplier successfully deactivated",
                data: supplier
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "supplier failed to deactivate",
            });
        };
    },

    async activateSupplier(
        req: Request,
        res: Response
    ) {
        try {
            const id = Number(req.params.id);

            const supplier = await supplierService.activateSupplier(id);
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "supplier successfully activated",
                data: supplier
            });
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "supplier failed to activate"
            });
        };
    },

    async getSuppliers(
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

            const result = await supplierService.getSuppliers(
                page,
                limit,
                search,
                isActive
            );

            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Supplier successfully retrieved",
                data: result
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Supplier failed to retrieve"
            });
        };
    },

    async updateSupplier(
        req: Request,
        res: Response
    ) {
        try {
            const id = Number(req.params.id);
            const { name, email, phone, address, contactName } = req.body;

            const supplier = await supplierService.updateSupplier(
                id,
                name,
                email,
                phone,
                address,
                contactName
            );

            res.status(StatusCodes.OK).json({
                success: true,
                message: "Supplier successfully updated",
                data: supplier
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to update",
            });
        };
    },

    async getSupplierById(
        req: Request,
        res: Response
    ) {
        try {
            const id = Number(req.params.id);

            const supplier = await supplierService.getSupplierById(id);
            res.status(StatusCodes.OK).json({
                success: true,
                message: "Supplier successfully retrieved",
                data: supplier
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to retrieve supplier",
            });
        };
    },
}