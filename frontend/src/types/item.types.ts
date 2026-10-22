export interface CreateItem {
    sku: string;
    name: string;
    stock: number;
    minimumStock: number;
    unit: string;
    purchasePrice: number;
    categoryId: number;
    supplierId: number;
    description?: string;
}

export interface UpdateItem {
    sku?: string;
    name?: string;
    minimumStock?: number;
    unit?: string;
    purchasePrice?: number;
    categoryId?: number;
    supplierId?: number;
    description?: string;
}

export interface ItemRelation {
    id: number;
    name: string;
}

export interface ItemsData {
    id: number;
    sku: string;
    name: string;
    description: string | null;
    stock: number;
    minimumStock: number;
    unit: string;
    purchasePrice: number | string;
    isActive: boolean;

    categoryId: number;
    supplierId: number;
    createdById: number;
    updatedById: number | null;

    category: ItemRelation;
    supplier: ItemRelation;
    createdBy: ItemRelation;
    updatedBy: ItemRelation | null;

    createdAt: string;
    updatedAt: string;
}

export interface ItemsFormValues {
    sku: string;
    name: string;
    description: string;
    stock: number;
    minimumStock: number;
    unit: string;
    purchasePrice: number;
    categoryId: number;
    supplierId: number;
}

export interface GetItemsParams {
    page: number;
    limit: number;
    search?: string;
    isActive?: boolean;
}
