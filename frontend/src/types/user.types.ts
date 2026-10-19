type Role = "ADMIN" | "STAFF";

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface loginData {
    email: string;
    password: string;
}

export interface registerData {
    name: string;
    email: string;
    password: string;
}

export interface getUsers {
    page: number,
    limit: number,
    search?: string,
    isActive?: boolean,
}

export interface changePassword {
    currentPassword: string;
    newPassword: string;
}

export interface updateUser {
    name?: string;
    email?: string;
}

export interface UserFormValues {
    name: string;
    email: string;
    password: string
}

export interface UserData {
    id: number;
    name: string;
    email: string
}

