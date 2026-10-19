export interface createItem {
    sku: string,
    name: string,
    stock: number,
    minimumStock: number,
    unit: string,
    purchasePrice: number,
    categoryId: number,
    description?: string,
}

export interface getItems {
    page: number,
    limit: number,
    search?: string,
    isActive?: boolean,
}