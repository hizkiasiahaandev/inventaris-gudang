import Spinner from "@/components/common/Spinner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category } from "@/types/category.types";
import type { Mode } from "@/types/mode.type";
import { Archive, Boxes, Check, CheckCircle, Container, Edit, Ellipsis, Eye, Info, Package, PackageOpen, Plus, Search, X, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CategoriesFormDialog from "./CategoriesFormDialog";
import type { StatusFilter } from "@/types/filter-status";
import { categoryService } from "@/services/category.service";
import { date } from "@/utils/date";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import axios from "axios";
import type { ErrorResponse } from "@/types/api";
import CategoryDetailsDialog from "./CategoryDetailsDialog";
import { Badge } from "@/components/ui/badge";

export default function ManageCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [mode, setMode] = useState<Mode>("create");
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [totalCategories, setTotalCategories] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, statusFilter, itemsPerPage]);

    const fetchCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await categoryService.getCategories({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                isActive:
                    statusFilter === "all"
                        ? undefined
                        : statusFilter === "active"
            });

            setCategories(response.data.data);
            setTotalCategories(response.data.pagination.total);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setError("Failed to load categories.");
            setCategories([]);
            setTotalCategories(0);
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
        fetchCategories();
    }, [fetchCategories]);



    const categoryIcons = [
        Package,
        Boxes,
        Archive,
        Container,
        PackageOpen,
    ];


    const statusItems = [
        { label: "All", value: "all" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
    ];

    const categoryColumns = [
        "Name",
        "Description",
        "Status",
        "Created At",
        "Updated At",
        "Actions",
    ];


    const handleCreate = () => {
        setSelectedCategory(null);
        setMode("create");
        setIsDialogOpen(true);
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setMode("edit");
        setIsDialogOpen(true);
    };

    const handleViewDetails = (category: Category) => {
        setSelectedCategoryId(category.id);
        setIsDetailsOpen(true);
    }

    const handleActivate = async (id: number) => {
        try {
            await categoryService.activateCategory(id);

            setCategories((prev) =>
                prev.map((category) =>
                    category.id === id
                        ? { ...category, isActive: true }
                        : category
                )
            );
        } catch (error) {
            window.alert(
                axios.isAxiosError<ErrorResponse>(error)
                    ? error.response?.data.message ||
                    "Failed to activate category."
                    : "An unexpected error occured"
            );
        };
    };

    const handleDeactivate = async (id: number) => {
        try {
            await categoryService.deactivateCategory(id);
            setCategories((prev) =>
                prev.map((caetgory) =>
                    caetgory.id === id
                        ? { ...caetgory, isActive: false }
                        : caetgory
                )
            );
        } catch (error) {
            window.alert(
                axios.isAxiosError<ErrorResponse>(error)
                    ? error.response?.data.message ||
                    "Failed to deactivate category"
                    : "An unexpected error occured"
            );
        };
    };





    const startIndex =
        totalCategories === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const endIndex = Math.min(
        currentPage * itemsPerPage,
        totalCategories
    );

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between md:items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                        Manage Categories
                    </h2>
                    <p className="text-sm text-slate-500">
                        Manage all product categories
                    </p>
                </div>

                <button
                    onClick={handleCreate}
                    className="inline-flex transition-all duration-100 items-center gap-2 px-4 bg-slate-800 rounded-lg shadow-sm hover:shadow-xl text-sm text-white focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 font-medium shadow-slate-600/15 border-slate-300/50 border py-2"
                >
                    <Plus size={14} />
                    Add Category
                </button>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-slate-200">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                            placeholder="Search name..."
                            className="w-full pl-9 py-5 border shadow-sm border-slate-200"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 font-medium">Status:</span>
                        <Select
                            value={statusFilter}
                            onValueChange={(v) =>
                                setStatusFilter(v as StatusFilter)
                            }>
                            <SelectTrigger className="w-full md:w-40 border border-slate-200 shadow-sm sm:max-w-52">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    {statusItems.map((item) => (
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
                    <table className="w-full text-left text-sm">
                        <thead className="text-white font-semibold">
                            <tr className="bg-slate-800/95">
                                {categoryColumns.map((column) => (
                                    <th
                                        key={column}
                                        className={`whitespace-nowrap px-3 py-3 ${column === "Actions"
                                            ? "text-right"
                                            : ""
                                            }`}
                                    >
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={categoryColumns.length}
                                        className="px-3 py-8"
                                    >
                                        <Spinner text="Loading data" size={66} />
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td
                                        colSpan={categoryColumns.length}
                                        className="px-3 py-8 text-sm text-red-500"
                                    >
                                        <div className="flex text-xs items-center gap-1 justify-center">
                                            <Info size={13} /> {error}

                                            <button
                                                type="button"
                                                onClick={fetchCategories}
                                                className="ml-2 font-medium underline"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={categoryColumns.length}
                                        className="px-3 py-8"
                                    >
                                        <div className="flex items-center gap-1 text-red-500 justify-center text-xs">
                                            <Info size={13} />
                                            <span>No categorirs found.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="box-border border-slate-100 transition-colors hover:bg-slate-50"
                                    >
                                        <td className="whitespace-nowrap px-3 py-3">
                                            <div className="flex items-center gap-3">
                                                {(() => {
                                                    const Icon =
                                                        categoryIcons[
                                                        Math.floor(Math.random() * categoryIcons.length)
                                                        ];

                                                    return (
                                                        <div className="flex size-10 items-center justify-center rounded-lg bg-slate-800 text-slate-50">
                                                            <Icon className="size-5" />
                                                        </div>
                                                    );
                                                })()}

                                                <p className="font-medium text-slate-800">
                                                    {category.name}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-3">
                                            {category.description}
                                        </td>

                                        <td
                                            className="px-3 py-3 ">
                                            <Badge
                                                variant="outline"
                                                className={category.isActive
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    : "border-red-200 bg-red-50 text-red-700"
                                                }
                                            >
                                                {category.isActive ? (
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
                                            {date(category.createdAt)}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-3">
                                            {date(category.updatedAt)}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                                    title="See category details"
                                                    onClick={() => handleViewDetails(category)}
                                                    aria-label="See category details"
                                                >
                                                    <Eye className="size-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(category)}
                                                    className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                                    title="Edit category"
                                                    aria-label="Edit category"
                                                >
                                                    <Edit className="size-4" />
                                                </button>

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
                                                            <DropdownMenuLabel>Category Status</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                disabled={category.isActive}
                                                                onClick={() => handleActivate(category.id)}
                                                                className="cursor-pointer"
                                                            >
                                                                <Check className="mr-2 size-4" />
                                                                Activate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                disabled={!category.isActive}
                                                                onClick={() => handleDeactivate(category.id)}
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
                                {startIndex}-{endIndex} of {totalCategories}
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

            <CategoriesFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                mode={mode}
                categories={selectedCategory}
                onSuccess={async () => {
                    setIsDialogOpen(false);
                    await fetchCategories();
                }}
            />

            <CategoryDetailsDialog
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                categoryId={selectedCategoryId}
            />
        </div>
    );
};