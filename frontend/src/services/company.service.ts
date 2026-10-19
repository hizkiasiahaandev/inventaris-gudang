import { api } from "@/api/axios";
import type { CompanyProfileService, updateCompanyProfile } from "@/types/company.types";

export const companyService = {
    async createCompany(data: CompanyProfileService) {
        const response = await api.post("/company", data);
        return response.data;
    },

    async getCompanyProfile() {
        const response = await api.get("/company");
        return response.data;
    },

    async updateCompanyProfile(data:updateCompanyProfile) {
        const response = await api.patch("/company", data);
        return response.data;
    },
};