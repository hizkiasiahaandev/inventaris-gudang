import type { StockMovementStatus, StockMovementType } from "./stock.types";

export type StatusFilter = "all" | "active" | "inactive";

export type StockStatusFilter = "all" | StockMovementType;

export type StockStatusMovement = "all" | StockMovementStatus;