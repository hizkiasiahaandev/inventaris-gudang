import { prisma } from "../lib/prisma"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import type { Role } from "../../generated/prisma/enums";
import type { Prisma } from "../../generated/prisma/client";

export const userService = {
    async login(
        email: string,
        password: string
    ) {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new Error("Invalid email or password");
        }

        if (!user.password) {
            throw new Error("Invalid email or password");
        }

        if (!user.isActive) {
            throw new Error("Account is inactive");
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
            },
            ENV.JWT_SECRET,
            {
                expiresIn: "1d",
            },
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            }
        };
    },

    async registerByAdmin(
        name: string,
        email: string,
        password: string,
        role: Role
    ) {

        if (!name || !email || !password) {
            throw new Error("Name , email and password are required");
        };

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            }
        });

        if (existingUser) {
            throw new Error("Email  already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        return await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
            omit: {
                password: true,
            }
        });

    },

    async getMe(userId: number) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            omit: {
                password: true,
            },
        });

        if (!user) {
            throw new Error("User is not found")
        }

        return user;
    },

    async deactivateUser(
        id: number,
        userId: number
    ) {

        if (id <= 0 || !Number.isInteger(id)) {
            throw new Error("Invalid user ID");
        }

        if (userId === id) {
            throw new Error("You cannot deactivate yourself");
        }

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        if (!user.isActive) {
            throw new Error("User has been deactivated");
        }

        return await prisma.user.update({
            where: {
                id,
            },
            data: {
                isActive: false,
            },
            omit: {
                password: true
            },
        });
    },

    async activateUser(userId: number) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        if (user.isActive) {
            throw new Error("User is already active");
        }

        return await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                isActive: true,
            },
            omit: {
                password: true,
            },
        });
    },

    async getUsers(
        page: number,
        limit: number,
        search?: string,
        isActive?: boolean,
    ) {
        const skip = (page - 1) * limit;

        const where: Prisma.UserWhereInput = {
            ...(search && {
                OR: [
                    {
                        name: {
                            contains: search,
                        },
                    },
                    {
                        email: {
                            contains: search
                        }
                    }
                ],
            }),

            ...(isActive !== undefined && {
                isActive,
            }),
        };

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                omit: {
                    password: true,
                },
            }),

            prisma.user.count({
                where,
            }),
        ]);


        return {
            data: users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    async changePassword(
        userId: number,
        currentPassword: string,
        newPassword: string
    ) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password,
        );

        if (!isPasswordValid) {
            throw new Error("Current password is incorrect");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedPassword,
            },
            omit: {
                password: true,
            }
        });
    },

    async logout() {

    },

    async updateUser(
        userId: number,
        name?: string,
        email?: string
    ) {
        if (userId <= 0 || !Number.isInteger(userId)) {
            throw new Error("Invalid user ID");
        }

        if (email) {
            const existingUser = await prisma.user.findUnique({
                where: {
                    email
                },
            });

            if (existingUser && existingUser.id !== userId) {
                throw new Error("Email already exists")
            }
        };

        return prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email })
            },
            omit: {
                password: true,
            }
        });

    },

    async getUserById(userId: number) {
        if (userId <= 0 || !Number.isInteger(userId)) {
            throw new Error("Invalid user ID");
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            omit: {
                password: true,
            },
        });

        return user;
    }
};