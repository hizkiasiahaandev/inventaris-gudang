import Spinner from "@/components/common/Spinner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ItemsData } from "@/types/item.types";
import type { Mode } from "@/types/mode.type";
import { Check, CheckCircle, Edit, Ellipsis, Eye, Info, Plus, Search, X, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ItemsFormDialog from "./ItemsFormDialog";
import type { StatusFilter } from "@/types/filter-status";
import { itemService } from "@/services/item.service";
import { Badge } from "@/components/ui/badge";
import { date } from "@/utils/date";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import axios from "axios";
import type { ErrorResponse } from "@/types/api";
import ItemDetailsDialog from "./ItemsDetailsDialog";
import CustomTooltip from "@/components/common/CustomTooltip";


export default function ManageItems() {
    const [items, setItems] = useState<ItemsData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [mode, setMode] = useState<Mode>("create");
    const [selectedItem, setSelectedItem] = useState<ItemsData | null>(null);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);


    const handleViewDetails = async (item: ItemsData) => {
        setSelectedItemId(item.id);
        setIsDetailsOpen(true);

    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
        });

        return () => clearTimeout(timer);
    }, [search]);


    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, statusFilter, itemsPerPage]);

    const fetchItems = useCallback(async () => {
        try {
            setIsLoading(true);
            setError("");

            const response = await itemService.getItems({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                isActive:
                    statusFilter === "all"
                        ? undefined
                        : statusFilter === "active"
            });

            setItems(response.data.data);
            setTotalItems(response.data.pagination.total);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            console.error("Failed to fetch items:", error);
            setError("Failed to load items.");
            setItems([]);
            setTotalItems(0);
            setTotalPages(0);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        };
    }, [
        currentPage,
        itemsPerPage,
        debouncedSearch,
        statusFilter
    ]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const startIndex =
        totalItems === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;


    const endIndex = Math.min(
        currentPage * itemsPerPage,
        totalItems
    );

    const StatusItems = [
        { label: "All", value: "all" },
        { label: "Active", value: "active" },
        { label: "Nonactive", value: "nonactive" }
    ];

    const itemColumns = [
        { key: "sku", label: "SKU" },
        { key: "name", label: "Name" },
        { key: "description", label: "Description" },
        { key: "stock", label: "Stock" },
        { key: "minimumStock", label: "Minimum Stock" },
        { key: "unit", label: "Unit" },
        { key: "purchasePrice", label: "Purchase Price" },
        { key: "isActive", label: "Status" },
        { key: "category", label: "Category" },
        { key: "supplier", label: "Supplier" },
        { key: "createdAt", label: "Created At" },
        { key: "updatedAt", label: "Updated At" },
        { key: "actions", label: "Actions", className: "text-right" },
    ];

    const handleCreate = () => {
        setSelectedItem(null);
        setIsDialogOpen(true);
        setMode("create");
    };

    const handleEdit = (item: ItemsData) => {
        setSelectedItem(item);
        setMode("edit");
        setIsDialogOpen(true);
    };

    const handleActivate = async (id: number) => {
        try {
            await itemService.activate(id);

            setItems((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? { ...item, isActive: true }
                        : item
                ),
            );
        } catch (error) {
            window.alert(
                axios.isAxiosError<ErrorResponse>(error)
                    ? error.response?.data.message ||
                    "Failed to activate item."
                    : "An unexpected error occured."
            );
        };
    };

    const handleDeactivate = async (id: number) => {
        try {
            await itemService.deactivate(id);

            setItems((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? { ...item, isActive: false }
                        : item
                ),
            );
        } catch (error) {
            window.alert(
                axios.isAxiosError<ErrorResponse>(error)
                    ? error.response?.data.message ||
                    "Failed to deactivate item."
                    : "An unexpected error occured."
            );
        };
    };



    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between md:items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                        Manage Items
                    </h2>
                    <p className="text-sm text-slate-500">
                        Manage all inventory items
                    </p>
                </div>
                <CustomTooltip content="Add Item">
                    <button
                        onClick={handleCreate}
                        className="inline-flex transition-all duration-100 items-center gap-2 px-4 bg-slate-800 rounded-lg shadow-sm hover:shadow-xl text-sm text-white focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 font-medium shadow-slate-600/15 border-slate-300/50 border py-2"
                    >
                        <Plus size={14} />
                        Add Item
                    </button>
                </CustomTooltip>

            </div>

            <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-slate-200">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                            type="text"
                            id="search-items"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                            }}
                            placeholder="Search Sku or name..."
                            className="w-full pl-9 py-5 border shadow-sm border-slate-200"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 font-medium">Status:</span>
                        <Select
                            value={statusFilter}
                            onValueChange={(v) => {
                                setStatusFilter(v as StatusFilter)
                            }}
                        >
                            <SelectTrigger className="w-full md:w-40 border border-slate-200 shadow-sm sm:max-w-52">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    {StatusItems.map((i) => (
                                        <SelectItem key={i.label} value={i.value}>
                                            {i.label}
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
                                {itemColumns.map((col) => (
                                    <th
                                        key={col.key}
                                        className={`whitespace-nowrap px-3 py-3  ${"className" in col ? col.className : ""
                                            }`}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={itemColumns.length}
                                        className="px-3 py-5"
                                    >
                                        <Spinner text="Loading data..." />
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td
                                        colSpan={itemColumns.length}
                                        className="px-3 py-8 text-sm text-destructive"
                                    >
                                        <div className="flex text-xs items-center gap-1 justify-center">
                                            <Info size={13} /> {error}

                                            <button
                                                type="button"
                                                onClick={fetchItems}
                                                className="ml-2 font-medium underline"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={itemColumns.length}
                                        className="px-3 py-8"
                                    >
                                        <div className="flex items-center gap-1 text-destructive justify-center text-xs">
                                            <Info size={13} />
                                            <span>No items found.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                                    >
                                        <td className="whitespace-nowrap text-slate-500  px-3 py-3 font-mono">
                                            {item.sku}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-800">
                                            {item.name}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-3">
                                            {item.description}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-4">
                                            {item.stock}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            {item.minimumStock}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            {item.unit}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            Rp. {item.purchasePrice}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            <Badge
                                                variant="outline"
                                                className={item.isActive
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    : "border-red-200 bg-red-50 text-red-700"
                                                }
                                            >
                                                {item.isActive ? (
                                                    <>
                                                        <CheckCircle />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle />
                                                        Inactive
                                                    </>
                                                )}
                                            </Badge>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            {item.category.name}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            {item.supplier.name}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            {date(item.createdAt)}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            {date(item.updatedAt)}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <CustomTooltip content="See Item details">
                                                    <button
                                                        type="button"
                                                        className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                                        aria-label="See Item details"
                                                        onClick={() => handleViewDetails(item)}
                                                    >
                                                        <Eye className="size-4" />
                                                    </button>
                                                </CustomTooltip>
                                                <CustomTooltip content="Edit item">
                                                    <button
                                                        type="button"
                                                        className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                                        onClick={() => handleEdit(item)}
                                                        aria-label="Edit supplier"
                                                    >
                                                        <Edit className="size-4" />
                                                    </button>
                                                </CustomTooltip>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger render={<button
                                                        type="button"
                                                        className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                                        title="More options"
                                                        aria-label="More options"
                                                    >
                                                        <Ellipsis className="size-5" />
                                                    </button>}>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44">
                                                        <DropdownMenuGroup>
                                                            <DropdownMenuLabel>Item Status</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                disabled={item.isActive}
                                                                className="cursor-pointer"
                                                                onClick={() => handleActivate(item.id)}
                                                            >
                                                                <Check className="mr-2 size-4" />
                                                                Activate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                disabled={!item.isActive}
                                                                className="cursor-pointer"
                                                                onClick={() => handleDeactivate(item.id)}
                                                            >
                                                                <X className="mr-2 size-4" />
                                                                Deactivate
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

                {!isLoading && !error && (
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
                                {startIndex}-{endIndex} of {totalItems}
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

            <ItemDetailsDialog
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                itemId={selectedItemId}
            />

            <ItemsFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                mode={mode}
                items={selectedItem}
                onSuccess={async () => {
                    setIsDialogOpen(false);
                    await fetchItems();
                }}
            />
        </div>
    );
};