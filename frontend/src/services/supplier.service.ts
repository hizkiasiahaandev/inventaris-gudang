import { api } from "@/api/axios";
import type { createSupplier, getSuppliers, updateSupplier } from "@/types/supplier.types";

export const supplierService = {
    async createSupplier(data: createSupplier) {
        const response = await api.post("/supplier", data);
        return response.data;
    },

    async deactivateSupplier(id: number) {
        const response = await api.patch(`/supplier/${id}/deactivate`);
        return response.data;
    },

    async activateSupplier(id: number) {
        const response = await api.patch(`/supplier/${id}/activate`);
        return response.data;
    },

    async getSuppliers(params: getSuppliers) {
        const response = await api.get("/supplier", {
            params,
        });
        return response.data;
    },

    async updateSupplier(data: updateSupplier, id: number) {
        const response = await api.patch(`/supplier/${id}/`, data);
        return response.data;
    },
    
    async getSupplierById(id: number) {
        const response = await api.get(`/supplier/${id}`);
        return response.data;
    },
};
