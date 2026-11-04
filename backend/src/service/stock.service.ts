import { Prisma } from "../../generated/prisma/client";
import { StockMovementStatus, StockMovementType } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import ExcelJS from "exceljs"
import type { ReportPeriod } from "../types/report-period";

export const stockService = {
    async createStockMovement(
        itemId: number,
        type: StockMovementType,
        quantity: number,
        createdById: number,
        note?: string,
    ) {
        if (!Number.isInteger(itemId) || itemId <= 0) {
            throw new Error("Invalid item ID");
        }

        if (!Number.isInteger(createdById) || createdById <= 0) {
            throw new Error("Invalid creator ID");
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error("Quantity must be a positive integer");
        }

        if (
            type !== StockMovementType.IN &&
            type !== StockMovementType.OUT
        ) {
            throw new Error("Invalid stock movement type");
        }

        return prisma.$transaction(async (tx) => {
            const item = await tx.item.findUnique({
                where: { id: itemId },
            });

            if (!item) {
                throw new Error("Item not found");
            }

            const creator = await tx.user.findUnique({
                where: { id: createdById },
                select: { id: true },
            });

            if (!creator) {
                throw new Error("Creator not found");
            }

            let newStock = item.stock;

            if (type === StockMovementType.IN) {
                newStock += quantity;
            } else {
                newStock -= quantity;

                if (newStock < item.minimumStock) {
                    throw new Error(
                        "Stock cannot be lower than minimum stock"
                    );
                }
            }

            const movement = await tx.stockMovement.create({
                data: {
                    item: {
                        connect: { id: itemId },
                    },
                    type,
                    status: StockMovementStatus.COMPLETED,
                    quantity,
                    ...(note !== undefined && { note }),
                    createdBy: {
                        connect: { id: createdById },
                    },
                },
                include: {
                    item: {
                        select: {
                            id: true,
                            sku: true,
                            name: true,
                        },
                    },
                    createdBy: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            const updatedItem = await tx.item.update({
                where: { id: itemId },
                data: { stock: newStock },
            });

            return {
                movement,
                item: updatedItem,
            };
        });
    },


    async getStockMovements(
        page: number,
        limit: number,
        search?: string,
        type?: StockMovementType,
        status?: StockMovementStatus,
        itemId?: number,
    ) {
        const skip = (page - 1) * limit;

        const where: Prisma.StockMovementWhereInput = {
            ...(type !== undefined && { type }),
            ...(status !== undefined && { status }),
            ...(itemId !== undefined && { itemId }),
            ...(search && {
                OR: [
                    {
                        item: {
                            name: {
                                contains: search
                            },
                        },
                    },
                    {
                        item: {
                            sku: {
                                contains: search,
                            },
                        },
                    },
                ],
            }),
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
                    createdBy: {
                        select: {
                            id: true,
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

        const movement = await prisma.stockMovement.findUnique({
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
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                cancelledBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!movement) {
            throw new Error("Stock movement not found");
        }

        return movement;
    },

    async cancelStockMovement(id: number, userId: number) {
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
            const updatedMovement = await tx.stockMovement.update({
                where: {
                    id,
                },
                data: {
                    status: StockMovementStatus.CANCELLED,
                    cancelledById: userId,
                    cancelledAt: new Date(),
                },
                include: {
                    item: {
                        select: {
                            id: true,
                            sku: true,
                            name: true,
                        },
                    },
                    createdBy: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    cancelledBy: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },

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

    async getStockMovementsHistory(
        page: number,
        limit: number,
        type?: StockMovementType,
        status?: StockMovementStatus,
        search?: string,
        fromDate?: string,
        toDate?: string,
    ) {
        const skip = (page - 1) * limit;

        const where: Prisma.StockMovementWhereInput = {
            ...(type && { type }),
            ...(status && { status }),

            ...(search && {
                OR: [
                    {
                        item: {
                            name: {
                                contains: search,
                            },
                        },
                    },
                    {
                        item: {
                            sku: {
                                contains: search,
                            },
                        },
                    },
                ],
            }),

            ...((fromDate || toDate) && {
                createdAt: {
                    ...(fromDate && {
                        gte: new Date(fromDate),
                    }),
                    ...(toDate && {
                        lt: new Date(
                            new Date(toDate).setDate(
                                new Date(toDate).getDate() + 1
                            ),
                        ),
                    }),
                },
            }),
        };

        const [data, total] = await Promise.all([
            prisma.stockMovement.findMany({
                where,
                skip,
                take: limit,
                include: {
                    item: {
                        include: {
                            category: true,
                            supplier: true,
                        },
                    },
                    createdBy: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    cancelledBy: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),

            prisma.stockMovement.count({ where }),
        ]);

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    async exportStockMovementsHistory(
        type?: StockMovementType,
        status?: StockMovementStatus,
        search?: string,
        fromDate?: string,
        toDate?: string
    ): Promise<Buffer> {
        const where: Prisma.StockMovementWhereInput = {
            ...(type && { type }),
            ...(status && { status }),

            ...(search && {
                OR: [
                    {
                        item: {
                            name: {
                                contains: search,
                            },
                        },
                    },
                    {
                        item: {
                            sku: {
                                contains: search,
                            },
                        },
                    },
                ],
            }),

            ...((fromDate || toDate) && {
                createdAt: {
                    ...(fromDate && {
                        gte: new Date(fromDate),
                    }),
                    ...(toDate && {
                        lt: new Date(
                            new Date(toDate).setDate(
                                new Date(toDate).getDate() + 1
                            ),
                        ),
                    }),
                },
            }),
        };

        const data = await prisma.stockMovement.findMany({
            where,
            include: {
                item: {
                    select: {
                        sku: true,
                        name: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                cancelledBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Stock Movement History");

        worksheet.columns = [
            { header: "Movement ID", key: "id", width: 15 },
            { header: "Tanggal", key: "createdAt", width: 22 },
            { header: "SKU", key: "sku", width: 18 },
            { header: "Nama Barang", key: "itemName", width: 25 },
            { header: "Tipe", key: "type", width: 12 },
            { header: "Kuantitas", key: "quantity", width: 14 },
            { header: "Status", key: "status", width: 16 },
            { header: "Catatan", key: "note", width: 30 },
            { header: "Dibuat Oleh", key: "createdBy", width: 22 },
            { header: "Dibatalkan Oleh", key: "cancelledBy", width: 22 },
            { header: "Tanggal Pembatalan", key: "cancelledAt", width: 22 },
        ];

        for (const movement of data) {
            worksheet.addRow({
                id: movement.id,
                createdAt: movement.createdAt,
                sku: movement.item.sku,
                itemName: movement.item.name,
                type: movement.type,
                quantity: movement.quantity,
                status: movement.status,
                note: movement.note ?? "-",
                createdBy: movement.createdBy?.name ?? "-",
                cancelledBy: movement.cancelledBy?.name ?? "-",
                cancelledAt: movement.cancelledAt ?? "-",
            });
        };

        const header = worksheet.getRow(1);
        header.font = {
            bold: true,
            color: { argb: "FFFFFFFF" },
        },
            header.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF1F4E78" },
            };
        header.alignment = {
            vertical: "middle",
            horizontal: "center",
        };
        header.height = 25;

        worksheet.getColumn("createdAt").numFmt = "dd/mm/yyyy hh:mm";
        worksheet.getColumn("cancelledAt").numFmt = "dd/mm/yyyy hh:mm";

        worksheet.getColumn("quantity").numFmt = "#,##0";

        worksheet.autoFilter = {
            from: "A1",
            to: "K1",
        };

        worksheet.views = [
            { state: "frozen", ySplit: 1 },
        ];

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    },

    async getStockMovementsReport(period: ReportPeriod = "7days") {
        const dayMap: Record<ReportPeriod, number> = {
            "7days": 7,
            "2weeks": 14,
            "1month": 30,
        };

        const days = dayMap[period];

        const endDate = new Date();
        const startDate = new Date();

        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(startDate.getDate() - (days - 1));

        const itemWhere: Prisma.ItemWhereInput = {
            isActive: true,
        };

        const movementWhere: Prisma.StockMovementWhereInput = {
            status: StockMovementStatus.COMPLETED,
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        };

        const [
            totalItems,
            lowStock,
            itemIn,
            itemOut,
            movements,
        ] = await Promise.all([
            prisma.item.count({
                where: itemWhere,
            }),

            prisma.item.count({
                where: {
                    ...itemWhere,
                    OR: [
                        {
                            stock: 0
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

            prisma.stockMovement.aggregate({
                where: {
                    ...movementWhere,
                    type: StockMovementType.IN,
                },
                _sum: {
                    quantity: true,
                },
            }),

            prisma.stockMovement.aggregate({
                where: {
                    ...movementWhere,
                    type: StockMovementType.OUT,
                },
                _sum: {
                    quantity: true,
                },
            }),

            prisma.stockMovement.groupBy({
                by: ["createdAt", "type"],
                where: movementWhere,
                _sum: {
                    quantity: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
        ]);

        const chartMap = new Map<string, { date: string, itemIn: number, itemOut: number }>();

        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);

            date.setDate(date.getDate() + i);

            const key = [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, "0"),
                String(date.getDate()).padStart(2, "0"),
            ].join("-");

            chartMap.set(key, {
                date: key,
                itemIn: 0,
                itemOut: 0
            });
        };

        for (const movement of movements) {
            const date = new Date(movement.createdAt);

            const key = [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, "0"),
                String(date.getDate()).padStart(2, "0"),
            ].join("-");

            const chart = chartMap.get(key);

            if (!chart) continue;

            const quantity = movement._sum.quantity ?? 0;

            if (movement.type === StockMovementType.IN) {
                chart.itemIn += quantity
            } else if (movement.type === StockMovementType.OUT) {
                chart.itemOut += quantity
            }
        }

        const chart = Array.from(chartMap.values());
        return {
            period,

            summary: {
                totalItems,
                lowStock,
                itemIn: itemIn._sum.quantity ?? 0,
                itemOut: itemOut._sum.quantity ?? 0,
            },

            chart,
        }
    },
};