import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export const itemService = {
    async createItem(
        sku: string,
        name: string,
        stock: number,
        minimumStock: number,
        unit: string,
        purchasePrice: number,
        categoryId: number,
        supplierId: number,
        createdById: number,
        description?: string,
    ) {

        if (!sku || !name || stock === undefined || minimumStock === undefined || !unit || purchasePrice === undefined || categoryId === undefined || supplierId === undefined || createdById === undefined) {
            throw new Error("Sku, name, stock, minumumStock, unit, purchasePrice, categoryId and creatorId are required");
        }

        if (stock < 0 || minimumStock < 0 || purchasePrice < 0) {
            throw new Error("Stock, minimum stock, and purchase price cannot be negative");
        }

        const existingItem = await prisma.item.findUnique({
            where: {
                sku,
            },
        });

        if (existingItem) {
            throw new Error("SKU already exists");
        }

        return prisma.item.create({
            data: {
                sku,
                name,
                description: description ?? null,
                stock: stock ?? 0,
                minimumStock: minimumStock ?? 0,
                unit,
                purchasePrice: purchasePrice ?? 0,
                category: {
                    connect: {
                        id: categoryId,
                    }
                },
                supplier: {
                    connect: {
                        id: supplierId,
                    },
                },

                createdBy: {
                    connect: {
                        id: createdById,
                    },
                },
            },
        });
    },

    async updateItem(
        id: number,
        sku: string,
        name: string,
        stock: number,
        minimumStock: number,
        unit: string,
        purchasePrice: number,
        categoryId: number,
        supplierId: number,
        updatedById: number,
        description?: string,
    ) {
        if (
            !sku ||
            !name ||
            stock === undefined ||
            minimumStock === undefined ||
            !unit ||
            purchasePrice === undefined ||
            categoryId === undefined ||
            supplierId === undefined ||
            updatedById === undefined
        ) {
            throw new Error(
                "SKU, name, stock, minimum stock, unit, purchase price, category ID, supplier ID, and updater ID are required."
            );
        };

        if (stock < 0 || minimumStock < 0 || purchasePrice < 0) {
            throw new Error("Stock, minimum stock, and purchase price cannot be negative.");
        };

        const existingItem = await prisma.item.findUnique({
            where: { id }
        });

        if (!existingItem) {
            throw new Error("Item not found.");
        };

        const duplicateSku = await prisma.item.findFirst({
            where: {
                sku,
                id: { not: id },
            },
        });

        if (duplicateSku) {
            throw new Error("SKU already exists.");
        };

        return prisma.item.update({
            where: { id },
            data: {
                sku,
                name,
                stock,
                minimumStock,
                unit,
                purchasePrice,
                description: description ?? null,

                category: {
                    connect: {
                        id: categoryId,
                    },
                },

                supplier: {
                    connect: {
                        id: supplierId,
                    },
                },

                updatedBy: {
                    connect: {
                        id: updatedById,
                    },
                },
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                updatedBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    },

    async deactivate(id: number) {
        const item = await prisma.item.findUnique({
            where: {
                id,
            },
        });

        if (!item) {
            throw new Error("Item not found");
        }

        if (!item.isActive) {
            throw new Error("Item has been deactivated");
        }

        return prisma.item.update({
            where: {
                id,
            },
            data: {
                isActive: false,
            },
        });
    },

    async activate(id: number) {
        const item = await prisma.item.findUnique({
            where: {
                id,
            },
        });

        if (!item) {
            throw new Error("Item not found");
        }

        if (item.isActive) {
            throw new Error("Item has been activated");
        }

        return prisma.item.update({
            where: {
                id,
            },
            data: {
                isActive: true,
            },
        });
    },

    async getItems(
        page: number,
        limit: number,
        search?: string,
        isActive?: boolean,
    ) {
        const skip = (page - 1) * limit;

        const where: Prisma.ItemWhereInput = {
            ...(search && {
                OR: [
                    {
                        sku: {
                            contains: search,
                        },
                    },
                    {
                        name: {
                            contains: search
                        }
                    }
                ]
            }),

            ...(isActive !== undefined && {
                isActive
            }),
        };

        const [items, total] = await Promise.all([
            prisma.item.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),

            prisma.item.count({
                where,
            }),
        ]);

        return {
            data: items,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
        };
    },

    async getItemById(id: number) {
        const item = await prisma.item.findUnique({
            where: { id },
            include: {
                category: true,
                supplier: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                updatedBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!item) {
            throw new Error("Item not found.");
        }


        return item;
    },
};