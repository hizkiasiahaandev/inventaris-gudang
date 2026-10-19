export type StockMovementType = "IN" | "OUT";
export type StockMovementStatus = "COMPLETED" | "CANCELLED";

export interface createStockMovement {
    itemId: number,
    type: StockMovementType,
    quantity: number,
    note?: string,
}

export interface getStockMovemnts {
    page: number,
    limit: number,
    type?: StockMovementType,
    status?: StockMovementStatus,
    itemId?: number,
}

