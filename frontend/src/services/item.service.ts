import { api } from "@/api/axios";
import type { createItem, getItems } from "@/types/item.types";

export const itemService = {
    async createItem(data: createItem) {
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

    async getItems(params: getItems) {
        const response = await api.get("/item", {
            params,
        });

        return response.data;
    },
};