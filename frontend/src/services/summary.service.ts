import { api } from "@/api/axios"

export const dashboardSummaryService = {
    async getSummary() {
        const response = await api.get("/dashboard/summary");
        return response.data;
    },
};