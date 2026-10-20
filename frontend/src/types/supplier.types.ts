export interface createSupplier {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    contactName?: string;
}

export interface getSuppliers {
    page: number,
    limit: number,
    search?: string,
    isActive?: boolean,
}

export interface updateSupplier {
    name?: string,
    email?: string,
    phone?: string,
    address?: string,
    contactName?: string
}

export interface SupplierFormValues {
    name: string;
    email: string;
    phone: string;
    address: string;
    contactName: string;
}

export interface SupplierData {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    contactName: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}