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
    id: number,
    name?: string,
    email?: string,
    phone?: string,
    address?: string,
    contactName?: string
}