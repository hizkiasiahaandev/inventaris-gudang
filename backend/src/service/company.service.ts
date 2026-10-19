import { prisma } from "../lib/prisma"

export const CompanyProfileService = {
    async createCompany(
        name: string,
        email?: string,
        phone?: string,
        address?: string,
        website?: string,
        description?: string,
        logo?: string
    ) {
        if (!name) {
            throw new Error("Company name is required");
        }

        return prisma.companyProfile.create({
            data: {
                name,
                ...(email !== undefined && { email }),
                ...(phone !== undefined && { phone }),
                ...(address !== undefined && { address }),
                ...(website !== undefined && { website }),
                ...(description !== undefined && { description }),
                ...(logo !== undefined && { logo }),
            },
        });
    },

    async getCompanyProfile() {
        const company = await prisma.companyProfile.findFirst();

        if (!company) {
            throw new Error("Company profile not found");
        }

        return company;
    },

    async updateCompanyProfile(
        name?: string,
        email?: string,
        phone?: string,
        address?: string,
        website?: string,
        description?: string,
        logo?: string
    ) {
        const company = await prisma.companyProfile.findFirst();

        if (!company) {
            throw new Error("Company profile not found");
        }

        return prisma.companyProfile.update({
            where: {
                id: company.id,
            },
            data: {
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email }),
                ...(phone !== undefined && { phone }),
                ...(address !== undefined && { address }),
                ...(website !== undefined && { website }),
                ...(description !== undefined && { description }),
                ...(logo !== undefined && { logo }),
            },
        });


    },
}