import { prisma } from "../lib/prisma"
import { addDays, formatDateKey, startDate, timezone, toZonedTime } from "../utils/date";

export const dashboardSummaryService = {
    async getSummary() {

        const [totalItems, totalStock, lowStock, totalSuppliers, lowStockItems, recentMovements, stockMovements,] = await Promise.all([

            prisma.item.count({
                where: {
                    isActive: true,
                },
            }),

            prisma.item.aggregate({
                where: {
                    isActive: true,
                },
                _sum: {
                    stock: true,
                },
            }),

            prisma.item.count({
                where: {
                    isActive: true,
                    OR: [
                        {
                            stock: 0,
                        },
                        {
                            minimumStock: {
                                gt: 0,
                            },
                            stock: {
                                lte: prisma.item.fields.minimumStock,
                            },
                        },
                    ],
                },
            }),

            prisma.supplier.count({
                where: {
                    isActive: true,
                },
            }),

            prisma.item.findMany({
                where: {
                    isActive: true,
                    OR: [
                        {
                            stock: 0,
                        },
                        {
                            minimumStock: {
                                gt: 0,
                            },
                            stock: {
                                lte: prisma.item.fields.minimumStock,
                            },
                        },
                    ],
                },

                select: {
                    id: true,
                    sku: true,
                    name: true,
                    stock: true,
                    minimumStock: true,
                    unit: true,
                },
                orderBy: {
                    stock: "asc",
                },
                take: 10,
            }),

            prisma.stockMovement.findMany({
                orderBy: {
                    createdAt: "desc",
                },
                take: 10,
                include: {
                    item: {
                        select: {
                            sku: true,
                            name: true,
                        },
                    },
                },
            }),

            prisma.stockMovement.findMany({
                where: {
                    createdAt: {
                        gte: startDate,
                    },
                    type: {
                        in: ["IN", "OUT"],
                    },
                },
                select: {
                    type: true,
                    quantity: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: "asc",
                },
            }),
        ]);

        const movementChart = Array.from(
            { length: 7 },
            (_, index) => ({
                date: formatDateKey(addDays(startDate, index)),
                stockIn: 0,
                stockOut: 0,
            }),
        );


        for (const movement of stockMovements) {
            const zoneDate = toZonedTime(
                movement.createdAt, 
                timezone
            );

            const dateKey = formatDateKey(
                zoneDate
            );

            const day = movementChart.find(
                (item) => item.date === dateKey,
            );

            if (!day) continue;

            if (movement.type === "IN") {
                day.stockIn += movement.quantity;
            }

            if (movement.type === "OUT") {
                day.stockOut += movement.quantity;
            }
        }

        return {
            totalItems,
            totalStock: totalStock._sum.stock ?? 0,
            lowStock,
            totalSuppliers,
            lowStockItems,
            recentMovements,
            movementChart,
        };
    },
};