import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export const supplierService = {
    async createSupplier(data: {
        name: string;
        email?: string;
        phone?: string;
        address?: string;
        contactName?: string;
    }) {
        if (data.email) {
            const existingSupplier = await prisma.supplier.findUnique({
                where: {
                    email: data.email
                }
            });
            if (existingSupplier) {
                throw new Error("Supplier email already exists");
            }
        }

        if (!data.name) {
            throw new Error("Supplier name is required");
        }

        return prisma.supplier.create({
            data: {
                name: data.name,
                email: data.email ?? null,
                phone: data.phone ?? null,
                address: data.address ?? null,
                contactName: data.contactName ?? null
            },
        });
    },

    async deactivateSupplier(id: number) {
        const supplier = await prisma.supplier.findUnique({
            where: {
                id,
            },
        });

        if (!supplier) {
            throw new Error("Supplier not found");
        }

        if (!supplier.isActive) {
            throw new Error("supplier has been deactivated");
        }

        return prisma.supplier.update({
            where: {
                id: id,
            },
            data: {
                isActive: false,
            },
        });
    },

    async activateSupplier(id: number) {
        const supplier = await prisma.supplier.findUnique({
            where: {
                id: id,
            },
        });

        if (!supplier) {
            throw new Error("Supplier not found");
        }

        if (supplier.isActive) {
            throw new Error("supplier has been activated");
        }

        return prisma.supplier.update({
            where: {
                id: id,
            },
            data: {
                isActive: true,
            },
        });
    },

    async getSuppliers(
        page: number,
        limit: number,
        search?: string,
        isActive?: boolean,
    ) {
        const skip = (page - 1) * limit;

        const where: Prisma.SupplierWhereInput = {
            ...(search && {
                OR: [
                    {
                        name: {
                            contains: search,
                        },
                    },
                    {
                        email: {
                            contains: search,
                        }
                    }
                ],
            }),


            ...(isActive !== undefined && {
                isActive
            }),
        };

        const [supplier, total] = await Promise.all([
            prisma.supplier.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),

            prisma.supplier.count({
                where
            }),
        ]);

        return {
            data: supplier,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    async updateSupplier(
        id: number,
        name?: string,
        email?: string,
        phone?: string,
        address?: string,
        contactName?: string
    ) {

        if (id <= 0 || !Number.isInteger(id)) {
            throw new Error("Invalid id");
        }

        if (email) {
            const existingSupplier = await prisma.supplier.findUnique({
                where: {
                    email
                },
            });

            if (existingSupplier && existingSupplier.id !== id) {
                throw new Error("Email already exists");
            }
        };

        return prisma.supplier.update({
            where: {
                id,
            },
            data: {
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email }),
                ...(phone !== undefined && { phone }),
                ...(address !== undefined && { address }),
                ...(contactName !== undefined && { contactName }),
            },
        });
    },

    async getSupplierById(
        id: number
    ) {
        if (id <= 0 || !Number.isInteger(id)) {
            throw new Error("Invalid supplier ID");
        }

        const supplier = await prisma.supplier.findUnique({
            where: {
                id,
            },
        });

        if (!supplier) {
            throw new Error("Supplier not found");
        }

        return supplier;
    },
}