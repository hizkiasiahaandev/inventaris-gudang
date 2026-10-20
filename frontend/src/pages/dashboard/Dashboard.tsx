import Spinner from "@/components/common/Spinner";
import { dashboardSummaryService } from "@/services/summary.service";
import type { ErrorResponse } from "@/types/api";
import type { DashboardSummary } from "@/types/dashboard.types";
import { statsData } from "@/types/dashboard/statsData";
import { date } from "@/utils/date";
import axios from "axios";
import { PackageMinus, PackagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import StockMovementsChart from "./StockMovementsChart";

export default function MainDashboard() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const data = statsData({
        totalItems: summary?.totalItems ?? 0,
        totalStock: summary?.totalStock ?? 0,
        lowStock: summary?.lowStock ?? 0,
        totalSuppliers: summary?.totalSuppliers ?? 0
    });

    useEffect(() => {
        const getSummary = async () => {
            try {
                const response = await dashboardSummaryService.getSummary();
                setSummary(response.data);
            } catch (error) {
                window.alert(
                    axios.isAxiosError<ErrorResponse>(error)
                        ? error.response?.data.message ||
                        "Failed to get dashboad summary"
                        : "An unexpected error occured"
                )
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 300);
            };
        };

        getSummary();
    }, []);

    const dashboadLowStock = [
        "SKU",
        "Name",
        "Stock",
        "Minimum Stock",
        "Unit"
    ];

    const dashboadRecentStock = [
        "Item",
        "Type",
        "Qty",
        "Date"
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold leading-tight  text-slate-800">
                    Dashboard Overview
                </h1>
                <p className="text-sm text-slate-500">
                    Monitor and manage your warehouse stock in real time
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {data.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.label}
                            className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-slate-500">
                                    {item.label}
                                </span>
                                <Icon className="size-4  text-slate-400" />
                            </div>

                            <div className="mt-3">
                                <div className="text-2xl font-bold tracking-tight text-slate-900">
                                    {item.value}
                                </div>
                                {item.desc && (
                                    <p className="mt-1 text-xs text-slate-500">
                                        {item.desc}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="w-full">
                <div className="flex w-full flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm">
                    <div>
                        <h2 className="text-sm  text-slate-800">
                            Stock Movements
                        </h2>
                        <p className="text-xs text-slate-500">
                            Latest incoming and outgoing stock activity (7 days)
                        </p>
                    </div>
                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Spinner text="Loading graphic" size={66} />
                        </div>
                    ) : summary?.movementChart.length ? (
                        <StockMovementsChart data={summary.movementChart} />
                    ) : (
                        <div className="flex h-64 items-center justify-center border border-dashed border-slate-200   text-slate-400">
                            No movement data
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm">
                    <div>
                        <h2 className="text-sm font-semibold  text-slate-800">
                            Low Stock Items
                        </h2>
                        <p className="text-xs text-slate-500">
                            Products that need immediate restocking
                        </p>
                    </div>
                    <div className="relative shadow-sm  overflow-x-auto overflow-hidden">
                        <table className="w-full  text-left text-xs">
                            <thead className="text-white font-semibold">
                                <tr className="bg-slate-800">
                                    {dashboadLowStock.map((col) => (
                                        <th key={col}
                                        className={`whitespace-nowrap px-3 py-2.5 ${col === "Unit"
                                            ? "text-right"
                                            : ""
                                        }`}
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-3 py-6">
                                            <Spinner text="Loading data" size={66} />
                                        </td>
                                    </tr>
                                ) : summary?.lowStockItems.length ? (
                                    summary.lowStockItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                                        >
                                            <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[12px] text-slate-500">{item.sku}</td>
                                            <td className="whitespace-nowrap px-3 py-2.5 text-slate-800 font-semibold">{item.name}</td>
                                            <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-destructive">{item.stock}</td>
                                            <td className="whitespace-nowrap px-3 py-2.5 text-slate-500">{item.minimumStock}</td>
                                            <td className="whitespace-nowrap px-3 py-2.5 text-slate-500 text-right">{item.unit}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-3 text-center py-6   text-slate-400">
                                            No Low stock items
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        { }
                    </div>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm">
                    <div>
                        <h2 className="text-sm font-semibold  text-slate-800">
                            Recent Stock Movements
                        </h2>
                        <p className="text-xs text-slate-500">
                            Latest incoming and outgoing stock activity
                        </p>
                    </div>

                    <div className="overflow-x-auto shadow-sm overflow-hidden">
                        <table className="w-full text-left text-xs">
                            <thead className="text-white font-semibold">
                                <tr className="bg-slate-800">
                                    {dashboadRecentStock.map((col) => (
                                        <th key={col} className={`whitespace-nowrap px-3 py-2.5 ${col === "Date"
                                            ? "text-right"
                                            : ""
                                        }`}>
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-3 py-6">
                                            <Spinner text="Loading data" size={66} />
                                        </td>
                                    </tr>
                                ) : summary?.recentMovements.length ? (
                                    summary.recentMovements.map((mv) => (
                                        <tr
                                            key={mv.id}
                                            className="border-b border-slate-100 last:border-0 hover:bg-gray-50 [&>td]:px-3 [&>td]:py-2"
                                        >
                                            <td className="whitespace-nowrap px-3 py-2.5">
                                                <div className="font-medium  text-slate-800">
                                                    {mv.item.name}
                                                </div>
                                                <div className="font-mono text-[12px] text-slate-500">
                                                    {mv.item.sku}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-2.5">
                                                <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold">
                                                    {mv.type === "IN" ? (
                                                        <PackagePlus className="size-3" />
                                                    ) : (
                                                        <PackageMinus className="size-3" />
                                                    )}
                                                    {mv.type}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-2.5  font-semibold  text-slate-800">
                                                {mv.quantity}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-2.5 text-slate-500 text-right">
                                                {date(mv.createdAt)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-3 py-6 text-center   text-slate-400">
                                            No recent Movements  stock items
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};