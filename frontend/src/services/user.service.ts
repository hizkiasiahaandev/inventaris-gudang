import { api } from "@/api/axios";
import type { changePassword, getUsers, loginData, registerData, updateUser } from "@/types/user.types";

export const userService = {
    async login(data: loginData) {
        const response = await api.post("/auth/login", data);
        return response.data;
    },

    async register(data: registerData) {
        const response = await api.post("/auth/register", data);
        return response.data;
    },

    async getUserById(id: number) {
        const response = await api.get(`/auth/${id}`);
        return response.data;
    },

    async getMe() {
        const response = await api.get("/auth/me");
        return response.data;
    },

    async getUsers(params: getUsers) {
        const response = await api.get("/auth", {
            params,
        });

        return response.data;
    },

    async deactivateUser(id: number) {
        const response = await api.patch(`/auth/${id}/deactivate`);
        return response.data;
    },

    async activateUser(id: number) {
        const response = await api.patch(`/auth/${id}/activate`);
        return response.data;
    },

    async changePassword(data: changePassword) {
        const response = await api.patch("/auth/change-password", data);
        return response.data;
    },

    async logout() {
        const response = await api.post("/auth/logout");
        return response.data;
    },

    async updateUser(id: number, data: updateUser) {
        const response = await api.put(`/auth/${id}`, data);
        return response.data;
    },
};