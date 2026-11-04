import CustomTooltip from "@/components/common/CustomTooltip";
import Spinner from "@/components/common/Spinner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { stockService } from "@/services/stock.service";
import type { StockStatusFilter, StockStatusMovement } from "@/types/filter-status";
import type { StockMovementData } from "@/types/stock.types";
import { date } from "@/utils/date";
import { CheckCircle, File, Info, PackageMinus, PackagePlus, Search, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function StockExportHistory() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [stocks, setStocks] = useState<StockMovementData[]>([]);

    const [typeFilter, setTypeFilter] = useState<StockStatusFilter>("all");
    const [statusFilter, setStatusFilter] = useState<StockStatusMovement>("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");

    const [totalStock, setTotalStock] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const handleExport = async () => {
        try {
            const response = await stockService.ExportStockHistoryMovements({
                type: typeFilter === "all" ? undefined : typeFilter,
                status: statusFilter === "all" ? undefined : statusFilter,
                search: debouncedSearch || undefined,
                fromDate: fromDate || undefined,
                toDate: toDate || undefined,
            });

            const url = window.URL.createObjectURL(response);

            const link = document.createElement("a");
            link.href = url;
            link.download = "stock-movement-history.xlsx";

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export stock history:", error);
        }
    };

    const fetchStock = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await stockService.getStockMovementsHistory({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                type: typeFilter === "all" ? undefined : typeFilter,
                status: statusFilter === "all" ? undefined : statusFilter,
                fromDate: fromDate || undefined,
                toDate: toDate || undefined,
            });

            setStocks(response.data.data);
            setTotalStock(response.data.meta.total);
            setTotalPages(response.data.meta.totalPages);
        } catch (error) {
            console.error("Failed to fetch stock.");
            setError("Failed to load stock history");
            setStocks([]);
            setTotalStock(0);
            setTotalPages(0);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 300);
        };
    }, [
        currentPage,
        itemsPerPage,
        debouncedSearch,
        typeFilter,
        statusFilter,
        fromDate,
        toDate,
    ]);

    const stockType: {
        label: string;
        value: StockStatusFilter;
    }[] = [
            { label: "All", value: "all" },
            { label: "In", value: "IN" },
            { label: "Out", value: "OUT" },
        ];

    const stockTypeStatus: {
        label: string;
        value: StockStatusMovement;
    }[] = [
            { label: "All", value: "all" },
            { label: "Completed", value: "COMPLETED" },
            { label: "Cancelled", value: "CANCELLED" },
        ];



    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);


    useEffect(() => {
        fetchStock();
    }, [fetchStock]);

    const startIndex =
        totalStock === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1

    const endIndex = Math.min(
        currentPage + itemsPerPage,
        totalStock,
    );



    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, typeFilter, statusFilter, itemsPerPage]);



    type StockColumnTable = {
        key: string;
        label: string;
    };

    const stockColumns: StockColumnTable[] = [
        { key: "sku", label: "SKU" },
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "status", label: "Status" },
        { key: "note", label: "Note" },
        { key: "quantity", label: "Quantity" },
        { key: "createdBy", label: "CreatedBy" },
        { key: "createdAt", label: "CreatedAt" },
        { key: "updatedAt", label: "UpdatedAt" },
    ];


    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                        Export Stock Movements
                    </h2>
                    <p className="text-sm text-slate-500">
                        Export incoming and outgoing inventory transaction history to Excel.
                    </p>
                </div>
                <CustomTooltip content="Export to excel">
                    <button
                        onClick={handleExport}
                        className="inline-flex transition-all duration-100 items-center gap-2 px-4 bg-slate-800 rounded-lg shadow-sm hover:shadow-xl text-sm text-white focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 font-medium shadow-slate-600/15 border-slate-300/50 border py-2"
                    >
                        <File size={14} />
                        Export
                    </button>
                </CustomTooltip>
            </div>
            <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex  flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-slate-200">
                    <div className="relative">
                        <Search className="absolute top-1/2 -translate-y-1/2 left-3 size-4 text-slate-400" />
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                            }}
                            id="search-history"
                            placeholder="Search movements history"
                            className="pl-9 py-5 border shadow-sm border-slate-200"
                        />
                    </div>

                    <div className="flex sm:items-center sm:flex-row flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600 font-medium">Type:</span>
                            <Select
                                value={typeFilter}
                                onValueChange={(value) => {
                                    setTypeFilter(value as StockStatusFilter)
                                }}
                            >
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Movement Type</SelectLabel>
                                        {stockType.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Select
                                value={statusFilter}
                                onValueChange={(value) => {
                                    setStatusFilter(value as StockStatusMovement)
                                }}
                            >
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Movement Status</SelectLabel>
                                        {stockTypeStatus.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-600">Date:</span>
                            <Input
                                type="date"
                                id="from-date"
                                onChange={(e) => setFromDate(e.target.value)}
                                className="border border-slate-200"
                            />
                            <Input
                                type="date"
                                id="to-date"
                                onChange={(e) => setToDate(e.target.value)}
                                className="border border-slate-200"
                            />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-slate-50 font-semibold">
                            <tr className="bg-slate-800">
                                {stockColumns.map((stock) => (
                                    <th
                                        key={stock.label}
                                        className="whitespace-nowrap px-3  py-4"
                                    >
                                        {stock.label}
                                    </th>
                                ))}</tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={stockColumns.length} className="px-3 py-5">
                                        <Spinner text="Loading data..." />
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={stockColumns.length}
                                        className="px-3 py-8 text-sm text-destructive"
                                    >
                                        <div className="flex text-xs gap-1 justify-center">
                                            <Info size={13} /> {error}
                                            <button
                                                onClick={fetchStock}
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
                                        <div className="flex items-center justify-center gap-1 text-xs text-destructive">
                                            <Info size={13} />
                                            <span>No Stock found.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                stocks.map((item) => (
                                    <tr key={item.id}
                                        className="border-b border-slate-100"
                                    >

                                        <td className="px-3 whitespace-nowrap to-slate-500 font-mono py-4">
                                            {item.item.sku}
                                        </td>

                                        <td className="px-3 py-4 whitespace-nowrap text-slate-800 font-semibold">
                                            {item.item.name}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-4">
                                            <Badge
                                                variant="outline"
                                                className={item.type === "IN"
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    : "border-red-200 bg-red-50 text-red-700"
                                                }
                                            >
                                                {item.type === "IN" ? (
                                                    <>
                                                        <PackagePlus />
                                                        IN
                                                    </>
                                                ) : (
                                                    <>
                                                        <PackageMinus />
                                                        OUT
                                                    </>
                                                )}
                                            </Badge>
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-4">
                                            <Badge
                                                variant="outline"
                                                className={item.status === "COMPLETED"
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    : "border-red-200 bg-red-50 text-red-700"
                                                }
                                            >
                                                {item.status === "COMPLETED" ? (
                                                    <>
                                                        <CheckCircle />
                                                        Completed
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle />
                                                        Cancelled
                                                    </>
                                                )}
                                            </Badge>
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-4">
                                            {item.note}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-4 font-semibold text-slate-800">
                                            {item.quantity}
                                        </td>

                                        <td className="whitespace-nowrap font-semibold text-slate-800 px-3 py-4">
                                            {item.createdBy.name}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-4">
                                            {item.createdAt ? date(item.createdAt) : "-"}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-4">
                                            {item.updatedAt ? date(item.updatedAt) : "-"}
                                        </td>



                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && !error && (
                    <div className="flex flex-col gap-4 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                            <span>Rows per page:</span>

                            <Select
                                value={String(itemsPerPage)}
                                onValueChange={(value) =>
                                    setItemsPerPage(Number(value))
                                }
                            >
                                <SelectTrigger className="w-20">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Rows per page</SelectLabel>
                                        <SelectSeparator />
                                        {[5, 10, 20, 50].map((size) => (
                                            <SelectItem
                                                key={size}
                                                value={String(size)}
                                            >
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <span>
                                {startIndex}-{endIndex} of {totalStock}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={currentPage <= 1}
                                onClick={() =>
                                    setCurrentPage((page) => page - 1)
                                }
                                className="rounded-md border border-slate-200 px-3 py-1.5 text-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <span className="whitespace-nowrap text-sm text-slate-600">
                                Page {currentPage} of{" "}
                                {Math.max(totalPages, 1)}
                            </span>

                            <button
                                type="button"
                                disabled={
                                    totalPages === 0 ||
                                    currentPage >= totalPages
                                }
                                onClick={() =>
                                    setCurrentPage((page) => page + 1)
                                }
                                className="rounded-md border border-slate-200 px-3 py-1.5 text-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};