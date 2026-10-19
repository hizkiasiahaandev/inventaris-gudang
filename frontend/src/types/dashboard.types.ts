type stockMovementType = "IN" | "OUT";

export interface LowStockItem {
    id: number;
    sku: string;
    name: string;
    stock: number;
    minimumStock: number;
    unit: string;
}

export interface RecentMovement {
    id: number;
    type: stockMovementType;
    quantity: number;
    createdAt: string;
    item: {
        sku: string;
        name: string;
    };
}

export interface MovementChart {
    date: string;
    stockIn: number;
    stockOut: number;
}

export interface DashboardSummary extends DashboardStats {
    lowStockItems: LowStockItem[];
    recentMovements: RecentMovement[];
    movementChart: MovementChart[];
}

export interface DashboardStats{
    totalItems: number;
    totalStock: number;
    lowStock: number;
    totalSuppliers: number;
}