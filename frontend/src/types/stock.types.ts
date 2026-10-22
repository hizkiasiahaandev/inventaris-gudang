export type StockMovementType = "IN" | "OUT";

export type StockMovementStatus = "COMPLETED" | "CANCELLED";

export interface CreateStockMovement {
    itemId: number;
    type: StockMovementType;
    quantity: number;
    note?: string;
}

export interface ItemRelation {
    id: number;
    sku: string;
    name: string;
}

export interface UserRelation {
    id: number;
    name: string;
}

export interface StockMovementData {
    id: number;
    itemId: number;
    type: StockMovementType;
    status: StockMovementStatus;
    quantity: number;
    note: string | null;

    item: ItemRelation;
    createdById: number;
    createdBy: UserRelation;

    createdAt: string;
    updatedAt: string;
}

export interface GetStockMovementsParams {
    page: number;
    limit: number;
    type?: StockMovementType;
    status?: StockMovementStatus;
    itemId?: number;
}