import CustomTooltip from "@/components/common/CustomTooltip";
import Spinner from "@/components/common/Spinner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StockMovementData } from "@/types/stock.types";
import { Info, Plus, Search } from "lucide-react";
import { useState } from "react";

export default function StockMovements() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [stocks, setStocks] = useState<StockMovementData[]>([]);

    const stockType = [
        { label: "All", value: "all" },
        { label: "In", value: "in" },
        { label: "Out", value: "out" }
    ];

    const stockTypeStatus = [
        { label: "All", value: "all" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" }
    ];


    const stockColumns = [
        { key: "sku", label: "SKU" },
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "status", label: "Status" },
        { key: "note", label: "Note" },
        { key: "quantity", label: "Quantity" },
        { key: "createdById", label: "CreatedById" },
        { key: "createdBy", label: "CreatedBy" },
        { key: "createdAt", label: "CreatedAt" },
        { key: "updatedAt", label: "UpdatedAt" },
        { key: "actions", label: "Actions", className: "text-right" },
    ];


    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between md:items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                        Stock Movements
                    </h2>
                    <p className="text-sm text-slate-500">
                        Track and manage all inventory stock movements.
                    </p>
                </div>

                <CustomTooltip content="Create Stock Movement">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300/50 bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-slate-600/15 transition-all duration-100 hover:shadow-xl focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    >
                        <Plus size={14} />
                        Create Movement
                    </button>
                </CustomTooltip>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-slate-200">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 -translate-y-1/2 top-1/2 size-4 text-slate-400" />
                        <Input
                            type="text"
                            id="search-stockmovements"
                            placeholder="Search stock movements"
                            className="w-full pl-9 border shadow-sm py-5 border-slate-200"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 font-medium">Status:</span>
                        <Select>
                            <SelectTrigger className="w-full md:w-40 border border-slate-200 shadow-sm sm:max-w-52">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Type movement</SelectLabel>
                                    {stockType.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-full md:w-40 border border-slate-200 shadow-sm sm:max-w-52">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Type movement status </SelectLabel>
                                    {stockTypeStatus.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-slate-50 font-semibold">
                            <tr className="bg-slate-800">
                                {stockColumns.map((stock) => (
                                    <th
                                        key={stock.label}
                                        className={`whitespace-nowrap px-3 py-3 ${"Classname" in stock ? stock.className : ""}`}
                                    >
                                        {stock.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={stockColumns.length}
                                        className="px-3 py-5"
                                    >
                                        <Spinner text="Loading data..." />
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td
                                        colSpan={stockColumns.length}
                                        className="px-3 py-8 text-sm text-destructive"
                                    >
                                        <div className="flex text-xs items-center gap-1 justify-center">
                                            <Info size={13} /> {error}

                                            <button
                                                type="button"
                                                className="ml-2 font-medium underline"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : stocks.length === 0 ? (
                                <tr>
                                    <td colSpan={stockColumns.length}
                                        className="px-3 py-8"
                                    >
                                        <div className="flex items-center gap-1 text-destructive justify-center text-xs">
                                            <Info size={13} />
                                            <span>No Stock found.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td className="py-8">
                                        <Spinner text="Loadingg data..." />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};