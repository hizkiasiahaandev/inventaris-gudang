import CustomTooltip from "@/components/common/CustomTooltip";
import Spinner from "@/components/common/Spinner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StockMovementData } from "@/types/stock.types";
import { CheckCircle, Ellipsis, Eye, Info, PackageMinus, PackagePlus, Plus, Search, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import StockMovementsDialog from "./StockFormDialog";
import type { StockStatusMovement, StockStatusFilter } from "@/types/filter-status";
import { stockService } from "@/services/stock.service";
import { Badge } from "@/components/ui/badge";
import { date } from "@/utils/date";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import axios from "axios";
import type { ErrorResponse } from "@/types/api";
import StockDetailsDialog from "./StockDetailsDialog";

export default function StockMovements() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>("");
    const [stocks, setStocks] = useState<StockMovementData[]>([]);

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [detailOpen, setDetailOpen] = useState<boolean>(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StockStatusFilter>("all");
    const [statusFilterStock, setStatusFilterStock] = useState<StockStatusMovement>("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null)

    const [totalStock, setTotalStock] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, statusFilter, statusFilterStock, itemsPerPage]);


    const fetchStock = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await stockService.getStockMovemnts({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                type: statusFilter === "all" ? undefined : statusFilter,
                status: statusFilterStock === "all" ? undefined : statusFilterStock,
                itemId: selectedItemId ?? undefined
            });
            setStocks(response.data.data);
            setTotalStock(response.data.pagination.total);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            console.error("Failed to fetch stock", error);
            setError("Failed to load stock");
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
        statusFilter,
        statusFilterStock,
    ]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
        });

        return () => clearTimeout(timer);
    }, [search])

    useEffect(() => {
        fetchStock();
    }, [fetchStock]);

    const startIndex =
        totalStock === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const endIndex = Math.min(
        currentPage + itemsPerPage,
        totalStock,
    );



    const handleCreate = () => {
        setDialogOpen(true);
    };

    const handleViewDetails = async (stock: StockMovementData) => {
        setDetailOpen(true);
        setSelectedItemId(stock.id);
    }

    const handleCancel = async (id: number) => {
        try {
            await stockService.cancelStockMovement(id);

            setStocks((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? { ...item, status: "CANCELLED" }
                        : item
                )
            );
        } catch (error) {
            window.alert(
                axios.isAxiosError<ErrorResponse>(error)
                    ? error.response?.data.message ||
                    "Failed to cancel stock movement"
                    : "An unexpected error occured"
            );
        };
    };

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


    type StockColumnTable = {
        key: string;
        label: string;
        className?: string;
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
                        onClick={handleCreate}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300/50 bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-slate-600/15 transition-all duration-100 hover:shadow-xl focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    >
                        <Plus size={14} />
                        Create
                    </button>
                </CustomTooltip>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-slate-200">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 -translate-y-1/2 top-1/2 size-4 text-slate-400" />
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                            }}
                            id="search-stockmovements"
                            placeholder="Search stock movements"
                            className="w-full pl-9 border shadow-sm py-5 border-slate-200"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 font-medium">Status:</span>
                        <Select
                            value={statusFilter}
                            onValueChange={(value) => {
                                setStatusFilter(value as StockStatusFilter)
                            }}
                        >
                            <SelectTrigger className="w-50 md:w-50 border border-slate-200 shadow-sm sm:max-w-52">
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
                        <Select
                            value={statusFilterStock}
                            onValueChange={(value) => {
                                setStatusFilterStock(value as StockStatusMovement)
                            }}
                        >
                            <SelectTrigger className="w-full md:w-40 border border-slate-200 shadow-sm sm:max-w-52">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel >Type movement status </SelectLabel>
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
                            {loading ? (
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
                                                onClick={fetchStock}
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
                                stocks.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                                    >
                                        <td className="whitespace-nowrap px-3 py-4 text-slate-500 font-mono">
                                            {item.item.sku}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-4 font-semibold text-slate-800">
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

                                        <td className="whitespace-nowrap font-semibold text-slate-800 px-3 py-4">
                                            {item.quantity}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-4">
                                            {item.createdBy.name}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-4">
                                            {item.createdAt ? date(item.createdAt) : ""}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-4">
                                            {item.updatedAt ? date(item.updatedAt) : ""}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <CustomTooltip content="See Stock Details">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleViewDetails(item)}
                                                        aria-label="See Stock Details"
                                                        className="rounded-md text-slate-600">
                                                        <Eye size={16} />
                                                    </button>
                                                </CustomTooltip>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        render={
                                                            <button
                                                                type="button"
                                                                className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                                                title="More options"
                                                                aria-label="More options"
                                                            >
                                                                <Ellipsis className="size-5" />
                                                            </button>
                                                        }>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44">
                                                        <DropdownMenuGroup>
                                                            <DropdownMenuLabel>Change stock status</DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                disabled={item.status === "CANCELLED"}
                                                                className="cursor-pointer"
                                                                onClick={() => handleCancel(item.id)}
                                                            >
                                                                <XCircle className="mr-2 size-4" />
                                                                Cancel Status
                                                            </DropdownMenuItem>
                                                        </DropdownMenuGroup>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
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

            <StockMovementsDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSuccess={async () => {
                    await fetchStock();
                }}
            />

            <StockDetailsDialog
                open={detailOpen}
                onOpenChange={setDetailOpen}
                stockId={selectedItemId}
            />
        </div>
    );
};