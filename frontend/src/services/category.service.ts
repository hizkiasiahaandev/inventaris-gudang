import { api } from "@/api/axios";
import type { createCategory, getCategories, updateCategory } from "@/types/category.types";

export const categoryService = {
    async createCategory(data: createCategory) {
        const response = await api.post("/category", data);
        return response.data;
    },

    async deactivateCategory(id: number) {
        const response = await api.patch(`/category/${id}/deactivate`);
        return response.data;
    },

     async activateCategory(id: number) {
        const response = await api.patch(`/category/${id}/activate`);
        return response.data;
     },

     async getCategories(params: getCategories) {
        const response = await api.get("/category", {
            params
        });

        return response.data;
     },

     async updateCategory(id: number, data: updateCategory) {
        const response = await api.put(`/category/${id}`, data);
        return response.data;
     },

     async getCategoryById(id: number) {
        const response = await api.get(`/category/${id}`);
        return response.data;
     },
};