import { Prisma } from "../../generated/prisma/client";
import { StockMovementStatus, StockMovementType } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const stockService = {
    async createStockMovement(
        itemId: number,
        type: StockMovementType,
        quantity: number,
        note?: string,
    ) {
        if (quantity <= 0 || !Number.isInteger(quantity)) {
            throw new Error("Quantity must be a positive integer");
        }


        const item = await prisma.item.findUnique({
            where: {
                id: itemId,
            },
        });

        if (!item) {
            throw new Error("Item not found");
        }

        let newStock = item.stock;

        if (type === StockMovementType.IN) {
            newStock = item.stock + quantity;
        }

        if (type === StockMovementType.OUT) {
            newStock = item.stock - quantity;

            if (newStock < item.minimumStock) {
                throw new Error("Stock cannot be lower than minimum stock");
            }
        }

        return prisma.$transaction(async (tx) => {
            const movement = await tx.stockMovement.create({
                data: {
                    itemId,
                    type,
                    status: StockMovementStatus.COMPLETED,
                    quantity,
                    ...(note !== undefined && { note }),
                },
            });

            const item = await tx.item.update({
                where: { id: itemId },
                data: {
                    stock: newStock,
                },
            });

            return {
                movement,
                item,
            };
        });
    },

    async getStockMovemnts(
        page: number,
        limit: number,
        type?: StockMovementType,
        status?: StockMovementStatus,
        itemId?: number,
    ) {
        const skip = (page - 1) * limit;

        const where: Prisma.StockMovementWhereInput = {
            ...(type !== undefined && { type }),
            ...(status !== undefined && { status }),
            ...(itemId !== undefined && { itemId })
        };

        if (
            type !== undefined &&
            type !== StockMovementType.IN
            && type !== StockMovementType.OUT
        ) {
            throw new Error("Invalid stock movement type");
        }

        if (
            status !== undefined &&
            status !== StockMovementStatus.COMPLETED
            && status !== StockMovementStatus.CANCELLED
        ) {
            throw new Error("Invalid stock movement status");
        }

        const [movements, total] = await prisma.$transaction([
            prisma.stockMovement.findMany({
                where,
                skip,
                take: limit,
                include: {
                    item: {
                        select: {
                            id: true,
                            sku: true,
                            name: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),

            prisma.stockMovement.count({
                where,
            }),
        ]);

        return {
            data: movements,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    async getStockMovementsById(
        id: number,
    ) {
        if (id <= 0 || !Number.isInteger(id)) {
            throw new Error("Invalid stock ID");
        }

        return prisma.stockMovement.findUnique({
            where: {
                id
            },
            include: {
                item: {
                    select: {
                        id: true,
                        sku: true,
                        name: true,
                    },
                },
            },
        });
    },

    async cancelStockMovement(id: number) {
        const movement = await prisma.stockMovement.findUnique({
            where: {
                id,
            },
            include: {
                item: true,
            },
        });

        if (!movement) {
            throw new Error("Stock movement not found");
        }

        if (movement.status === StockMovementStatus.CANCELLED) {
            throw new Error("Stock movement is already cancelled");
        }

        let newStock = movement.item.stock;

        if (movement.type === StockMovementType.IN) {
            newStock = movement.item.stock - movement.quantity;
        }

        if (movement.type === StockMovementType.OUT) {
            newStock = movement.item.stock + movement.quantity;
        }

        if (newStock < 0) {
            throw new Error("Stock cannot be negative");
        }

        return prisma.$transaction(async (tx) => {
            const updatedMovement = await prisma.stockMovement.update({
                where: {
                    id,
                },
                data: {
                    status: StockMovementStatus.CANCELLED,
                },
            });

            const updateItem = await tx.item.update({
                where: {
                    id: movement.itemId,
                },
                data: {
                    stock: newStock,
                },
            });

            return {
                movement: updatedMovement,
                item: updateItem,
            };
        });
    },
};