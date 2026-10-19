import { Package, Boxes, AlertTriangle, Truck } from "lucide-react";
import type { DashboardStats } from "../dashboard.types";

export const statsData = ({
    totalItems,
    totalStock,
    lowStock,
    totalSuppliers,
}: DashboardStats) => [
    {
        label: "Total Items",
        value: totalItems.toLocaleString("id-ID"),
        desc: "Active inventory items",
        icon: Package,
        bg: "bg-indigo-500 shadow-indigo-500/15",
    },
    {
        label: "Total Stock",
        value: totalStock.toLocaleString("id-ID"),
        desc: "Total units in inventory",
        icon: Boxes,
        bg: "bg-blue-500 shadow-blue-500/15",
    },
    {
        label: "Low Stock",
        value: lowStock.toLocaleString("id-ID"),
        desc: "Items at or below minimum stock",
        icon: AlertTriangle,
        bg: "bg-amber-500 shadow-amber-500/15",
    },
    {
        label: "Total Suppliers",
        value: totalSuppliers.toLocaleString("id-ID"),
        desc: "Registered supplier partners",
        icon: Truck,
        bg: "bg-purple-500 shadow-purple-500/15",
    },
];