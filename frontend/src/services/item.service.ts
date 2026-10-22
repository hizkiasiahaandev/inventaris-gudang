import { api } from "@/api/axios";
import type { CreateItem, GetItemsParams, UpdateItem } from "@/types/item.types";

export const itemService = {
    async createItem(data: CreateItem) {
        const response = await api.post("/item", data);
        return response.data;
    },

    async deactivate(id: number) {
        const response = await api.patch(`/item/${id}/deactivate`);
        return response.data;
    },

    async activate(id: number) {
        const response = await api.patch(`/item/${id}/activate`);
        return response.data;
    },

    async getItems(params: GetItemsParams) {
        const response = await api.get("/item", {
            params,
        });
        return response.data;
    },

    async updateItem(data: UpdateItem, id: number) {
        const response = await api.put(`/item/${id}`, data);
        return response.data;
    },

    async getItemById(id: number) {
        const response = await api.get(`/item/${id}`);
        return response.data;
    },
};