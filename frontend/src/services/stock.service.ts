import { api } from "@/api/axios";
import type { createStockMovement, getStockMovemnts } from "@/types/stock.types";

export const stockService = {
  async createStockMovement(data: createStockMovement) {
    const response = await api.post("/stock", data);
    return response.data;
  },

  async getStockMovemnts(params: getStockMovemnts) {
    const response = await api.get("/stock", {
      params
    });
    return response.data;
  },

  async getStockMovementsById(id: number) {
    const response = await api.get(`/stock/${id}`);
    return response.data;
  },

  async cancelStockMovement(id: number) {
    const response = await api.patch(`/stock/${id}/cancel`);
    return response.data;
  },
};