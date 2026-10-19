import type { Request, Response } from "express";
import { CompanyProfileService } from "../service/company.service";
import { StatusCodes } from "http-status-codes";

export const CompanyProfileController = {
    async createCompany(
        req: Request,
        res: Response
    ) {
        try {
            const {
                name,
                email,
                phone,
                address,
                website,
                description,
                logo
            } = req.body

            const companyProfile = await CompanyProfileService.createCompany(
                name,
                email,
                phone,
                address,
                website,
                description,
                logo
            );

            res.status(StatusCodes.CREATED).json({
                success: true,
                message: "CompanyProfile successfully created",
                data: companyProfile
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to create",
            });
        };
    },

    async getCompanyProfile(
        req: Request,
        res: Response
    ) {
        try {
            const company = await CompanyProfileService.getCompanyProfile();
            res.status(StatusCodes.OK).json({
                success: true,
                message: "Company profile successfully retrieved",
                data: company
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to retrieve company",
            });
        };
    },

    async updateCompanyProfile(
        req: Request,
        res: Response
    ) {
        try {
            const {
                name,
                email,
                phone,
                address,
                website,
                description,
                logo
            } = req.body

            const companyProfile = await CompanyProfileService.updateCompanyProfile(
                name,
                email,
                phone,
                address,
                website,
                description,
                logo
            );

            res.status(StatusCodes.OK).json({
                success: true,
                message: "Company profile successfully updated",
                data: companyProfile
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to update",
            });
        };
    },
}