import Spinner from "@/components/common/Spinner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Mode } from "@/types/mode.type";
import type { SupplierData } from "@/types/supplier.types";
import { Check, CheckCircle, Edit, Ellipsis, Eye, Info, Plus, Search, X, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import SupplierFormDialog from "./SupplierFormDialog";
import type { StatusFilter } from "@/types/filter-status";
import { supplierService } from "@/services/supplier.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { date } from "@/utils/date";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SupplierDetailsDialog from "./SupplierDetailsDialog";
import axios from "axios";
import type { ErrorResponse } from "@/types/api";
import CustomTooltip from "@/components/common/CustomTooltip";

export default function ManageSupplier() {
    const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [mode, setMode] = useState<Mode>("create");
    const [selectedSupplier, setSelectedSupplier] = useState<SupplierData | null>(null);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [totalSuppliers, setTotalSuppliers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);

    const supplierColumns = [
        "Name",
        "Phone",
        "Address",
        "Contact Name",
        "Status",
        "Created At",
        "Updated At",
        "Actions",
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
        });

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, statusFilter, itemsPerPage]);

    const fetchSuppliers = useCallback(async () => {
        try {
            setIsLoading(true);
            setError("");

            const response = await supplierService.getSuppliers({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                isActive:
                    statusFilter === "all"
                        ? undefined
                        : statusFilter === "active"
            });

            setSuppliers(response.data.data);
            setTotalSuppliers(response.data.pagination.total);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            console.error("Failed to fetch suppliers:", error);
            setError("Failed to load suppliers.");
            setSuppliers([]);
            setTotalSuppliers(0);
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
        fetchSuppliers();
    }, [fetchSuppliers]);

    const startIndex =
        totalSuppliers === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const endIndex = Math.min(
        currentPage * itemsPerPage,
        totalSuppliers
    );


    const handleCreate = () => {
        setSelectedSupplier(null);
        setMode("create");
        setIsDialogOpen(true);
    };

    const handleEdit = (supplier: SupplierData) => {
        setSelectedSupplier(supplier);;
        setMode("edit");
        setIsDialogOpen(true);
    };

    const handleViewDetails = async (supplier: SupplierData) => {
        setSelectedSupplierId(supplier.id);
        setIsDetailsOpen(true);
    };

    const handleActivate = async (id: number) => {
        try {
            await supplierService.activateSupplier(id);

            setSuppliers((prev) =>
                prev.map((supplier) =>
                    supplier.id === id
                        ? { ...supplier, isActive: true }
                        : supplier
                ),
            );
        } catch (error) {
            window.alert(
                axios.isAxiosError<ErrorResponse>(error)
                    ? error.response?.data.message ||
                    "Failed to activate supplier."
                    : "An unexpected error occured."
            );
        };
    };

    const handleDeactivate = async (id: number) => {
        try {
            await supplierService.deactivateSupplier(id);

            setSuppliers((prev) =>
                prev.map((supplier) =>
                    supplier.id === id
                        ? { ...supplier, isActive: false }
                        : supplier
                ),
            );
        } catch (error) {
            window.alert(
                axios.isAxiosError<ErrorResponse>(error)
                    ? error.response?.data.message ||
                    "Failed to deactivate supplier."
                    : "An unexpected error occured."
            );
        };
    };

    const items = [
        { label: "All", value: "all" },
        { label: "Active", value: "active" },
        { label: "Nonactive", value: "nonactive" }
    ];


    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between md:items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                        Manage Suppliers
                    </h2>
                    <p className="text-sm text-slate-500">
                        Manage all supplier information
                    </p>
                </div>

                <CustomTooltip content="Add Supplier">
                    <button
                        onClick={handleCreate}
                        className="inline-flex transition-all duration-100 items-center gap-2 px-4 bg-slate-800 rounded-lg shadow-sm hover:shadow-xl text-sm text-white focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 font-medium shadow-slate-600/15 border-slate-300/50 border py-2"
                    >
                        <Plus size={14} />
                        Add Supplier
                    </button>
                </CustomTooltip>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-slate-200">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                            type="text"
                            id="search-suppliers"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                            }}
                            placeholder="Search name or email..."
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
                                    {items.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full  text-left text-sm">
                        <thead className="text-white font-semibold">
                            <tr className="bg-slate-800">
                                {supplierColumns.map((col) => (
                                    <th
                                        key={col}
                                        className={`whitespace-nowrap px-3 py-3 ${col === "Actions"
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
                                    <td
                                        colSpan={supplierColumns.length}
                                        className="px-3 py-8"
                                    >
                                        <Spinner text="Loading data" size={66} />
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td
                                        colSpan={supplierColumns.length}
                                        className="px-3 py-8 text-sm text-destructive"
                                    >
                                        <div className="flex text-xs items-center gap-1 justify-center">
                                            <Info size={13} /> {error}

                                            <button
                                                type="button"
                                                onClick={fetchSuppliers}
                                                className="ml-2 font-medium underline"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : suppliers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={supplierColumns.length}
                                        className="px-3 py-8"
                                    >
                                        <div className="flex items-center gap-1 text-destructive justify-center text-xs">
                                            <Info size={13} />
                                            <span>No suppliers found.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                suppliers.map((supplier) => (
                                    <tr
                                        key={supplier.id}
                                        className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                                    >
                                        <td className="whitespace-nowrap px-3 py-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="size-8">
                                                    <AvatarImage
                                                        src="https://github.com/evilrabbit.png"
                                                        alt={supplier.name}
                                                    />
                                                    <AvatarFallback>
                                                        {supplier.name.slice(0, 2).toLocaleUpperCase() ?? "US"}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {supplier.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {supplier.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-3">
                                            {supplier.phone}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-3">
                                            {supplier.address}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-3">
                                            {supplier.contactName}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-3">
                                            <Badge
                                                variant="outline"
                                                className={supplier.isActive
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    : "border-red-200 bg-red-50 text-red-700"
                                                }
                                            >
                                                {supplier.isActive ? (
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

                                        <td className="whitespace-nowrap px-3 py-3">
                                            {date(supplier.createdAt)}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-3">
                                            {date(supplier.updatedAt)}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <CustomTooltip content="See supplier details">
                                                    <button
                                                        type="button"
                                                        className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                                        onClick={() => handleViewDetails(supplier)}
                                                        aria-label="See supplier details"
                                                    >
                                                        <Eye className="size-4" />
                                                    </button>
                                                </CustomTooltip>

                                               <CustomTooltip content="Edit supplier">
                                                 <button
                                                    type="button"
                                                    onClick={() => handleEdit(supplier)}
                                                    className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
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
                                                            <DropdownMenuLabel>Account Status</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                disabled={supplier.isActive}
                                                                onClick={() => handleActivate(supplier.id)}
                                                                className="cursor-pointer"
                                                            >
                                                                <Check className="mr-2 size-4" />
                                                                Activate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                disabled={!supplier.isActive}
                                                                onClick={() => handleDeactivate(supplier.id)}
                                                                className="cursor-pointer"
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
                                {startIndex}-{endIndex} of {totalSuppliers}
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

            <SupplierFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                mode={mode}
                suppliers={selectedSupplier}
                onSuccess={async () => {
                    setIsDialogOpen(false);
                    fetchSuppliers();
                }}
            />

            <SupplierDetailsDialog
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                supplierId={selectedSupplierId}
            />
        </div>
    );
};