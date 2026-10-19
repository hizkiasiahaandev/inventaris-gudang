import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma"

export const categoryService = {
    async createCategory(
        name: string,
        description?: string
    ) {
        if (!name) {
            throw new Error("Name is required");
        }

        const existingCategory = await prisma.category.findUnique({
            where: {
                name,
            },
        });

        if (existingCategory) {
            throw new Error("this category already exists")
        }



        return prisma.category.create({
            data: {
                name: name,
                description: description ?? null,
            }
        });
    },

    async deactivateCategory(id: number) {
        const category = await prisma.category.findUnique({
            where: {
                id,
            },
        });

        if (!category) {
            throw new Error("Category not found");
        }

        if (!category.isActive) {
            throw new Error("Category has been deactivated");
        }

        return prisma.category.update({
            where: {
                id,
            },
            data: {
                isActive: false,
            },
        });
    },

    async activateCategory(id: number) {
        const category = await prisma.category.findUnique({
            where: {
                id,
            },
        });

        if (!category) {
            throw new Error("Category not found");
        }

        if (category.isActive) {
            throw new Error("Categor has been activated");
        }

        return prisma.category.update({
            where: {
                id,
            },
            data: {
                isActive: true,
            },
        });
    },

    async getCategories(
        page: number,
        limit: number,
        search?: string,
        isActive?: boolean,
    ) {
        const skip = (page - 1) * limit;

        const where: Prisma.CategoryWhereInput = {
            ...(search && {
                OR: [
                    { name: { contains: search } }
                ],
            }),

            ...(isActive !== undefined && {
                isActive
            }),
        };

        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),

            prisma.category.count({
                where,
            }),
        ]);

        return {
            data: categories,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
        };
    },

    async updateCategory(
        id: number,
        name?: string,
        description?: string
    ) {
        if (name) {
            const existingCategory = await prisma.category.findUnique({
                where: {
                    name,
                },
            });

            if (existingCategory && existingCategory.id !== id) {
                throw new Error("category already exists")
            }
        };

        if (id <= 0 || Number.isNaN(id)) {
            throw new Error("Invalid id");
        }

        return prisma.category.update({
            where: {
                id
            },
            data: {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description })
            },
        });
    },

    async getCategoryById(
        CategoryId: number
    ) {
        if (CategoryId <= 0 || !Number.isInteger(CategoryId)) {
            throw new Error("Invalid category ID");
        }

        const category = await prisma.category.findUnique({
            where: {
                id: CategoryId
            },
        });

        if (!category) {
            throw new Error("Category not found");
        }


        return category;
    }
}