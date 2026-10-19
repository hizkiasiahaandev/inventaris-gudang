import type { Request, Response } from "express";
import { userService } from "../service/auth.service";
import { ENV } from "../config/env";
import { StatusCodes } from "http-status-codes";

export const userController = {
    async loginController(
        req: Request,
        res: Response,
    ) {
        try {
            const { email, password } = req.body;

            const result = await userService.login(
                email,
                password
            );

            res.cookie("token", result.token, {
                httpOnly: true,
                secure: ENV.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Login successful",
                data: result.user,
            });
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "login failed",
            })
        }
    },

    async registerByAdminController(
        req: Request,
        res: Response
    ) {
        try {
            const { name, email, password, role } = req.body;

            const user = await userService.registerByAdmin(
                name, email, password, role
            );

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "User created successfully",
                data: user
            });
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to create user"
            })
        }
    },

    async getMe(
        req: Request,
        res: Response
    ) {
        try {
            const userId = Number(req.user?.userId);

            const user = await userService.getMe(userId);

            res.status(StatusCodes.OK).json({
                success: true,
                message: "User successfully found",
                data: user,
            });
        } catch (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: error instanceof Error ? error.message : "User not found"
            })
        }
    },

    async deactivateUser(
        req: Request,
        res: Response
    ) {
        try {
            const id = Number(req.params.id);
            const userId = Number(req.user?.userId);
            const user = await userService.deactivateUser(
                id,
                userId,
            );

            res.status(StatusCodes.OK).json({
                success: true,
                message: "User successfully deactivated",
                data: user,
            });
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to disable user",
            })
        }
    },

    async activateUser(
        req: Request,
        res: Response
    ) {
        try {
            const userId = Number(req.params.id);
            const user = await userService.activateUser(userId);
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "User successfully activated",
                data: user,
            });
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to activate user",
            })
        }
    },

    async getUsers(
        req: Request,
        res: Response,
    ) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const search =
                typeof req.query.search === "string"
                    ? req.query.search
                    : undefined;

            const isActive =
                req.query.isActive !== undefined
                    ? req.query.isActive === "true"
                    : undefined

            const result = await userService.getUsers(
                page,
                limit,
                search,
                isActive
            );

            return res.status(StatusCodes.OK).json({
                success: true,
                message: "User successfully retrieved",
                data: result,
            });
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "User failed to retrieve"
            })
        };
    },

    async changePassword(
        req: Request,
        res: Response
    ) {
        try {
            const userId = Number(req.user?.userId);
            const { currentPassword, newPassword } = req.body
            const user = await userService.changePassword(
                userId,
                currentPassword,
                newPassword
            );

            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Password successfully changed",
                data: user
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Password failed to change"
            });
        };
    },

    async logout(
        req: Request,
        res: Response
    ) {
        try {
            const result = await userService.logout();
            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
            });

            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Logout successful",
                data: result
            })
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Logout failed",
            });
        };
    },

    async updateUser(
        req: Request,
        res: Response
    ) {
        try {
            const id = Number(req.params.id);
            const { name, email } = req.body;
            const user = await userService.updateUser(
                id,
                name,
                email
            );

            res.status(StatusCodes.OK).json({
                success: true,
                message: "User successfully updated",
                data: user
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to updated",
            });
        };
    },

    async getUserById(
        req: Request,
        res: Response
    ) {
        try {
            const id = Number(req.params.id);

            const user = await userService.getUserById(id);

            res.status(StatusCodes.OK).json({
                success: true,
                message: "User successfully retrieved",
                data: user
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to retrieved",
            });
        };
    },



};

