import Spinner from "@/components/common/Spinner";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { User } from "@/types/user.types";
import { CheckCircle, Edit, Ellipsis, Eye, Info, Plus, Search, UserCheck, UserX, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import UserFormDialog from "./UserFormDialog";
import { userService } from "@/services/user.service";
import type { StatusFilter } from "@/types/filter-status";
import { date } from "@/utils/date";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import axios from "axios";
import type { ErrorResponse } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import type { Mode } from "@/types/mode.type";
import UserDetailsDialog from "./UserDetailsDialog";
import CustomTooltip from "@/components/common/CustomTooltip";

export default function ManageUser() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [mode, setMode] = useState<Mode>("create");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedUserById, setSelectedUserById] = useState<number | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, statusFilter, itemsPerPage]);


    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);


            const response = await userService.getUsers({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                isActive:
                    statusFilter === "all"
                        ? undefined
                        : statusFilter === "active"
            });

            setUsers(response.data.data);
            setTotalUsers(response.data.pagination.total);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setError("Failed to load users.");
            setUsers([]);
            setTotalUsers(0);
            setTotalPages(0);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }
    }, [
        currentPage,
        itemsPerPage,
        debouncedSearch,
        statusFilter
    ]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCreate = () => {
        setSelectedUser(null);
        setMode("create");
        setIsDialogOpen(true);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setMode("edit");
        setIsDialogOpen(true);
    };

    const handleViewDetails = (user: User) => {
        setSelectedUserById(user.id);
        setIsDetailsOpen(true);
    };


    const handleActivate = async (id: number) => {
        try {
            await userService.activateUser(id);

            setUsers((prev) =>
                prev.map((user) =>
                    user.id === id
                        ? { ...user, isActive: true }
                        : user
                )
            );
        } catch (error) {
            window.alert(
                axios.isAxiosError<ErrorResponse>(error)
                    ? error.response?.data.message ||
                    "Failed to activate user"
                    : "An unExpectd error occured"
            );
        }
    };


    const handleDeactivate = async (id: number) => {
        try {
            await userService.deactivateUser(id);

            setUsers((prev) =>
                prev.map((user) =>
                    user.id === id
                        ? { ...user, isActive: false }
                        : user
                )
            );
        } catch (error) {
            console.error("Failed to deactivate user:", error);
            window.alert(
                axios.isAxiosError<ErrorResponse>(error)
                    ? error.response?.data?.message ||
                    "Failed to deactivate user."
                    : "An unexpected error occurred."
            );
        }
    };

    const statusItems = [
        { label: "All", value: "all" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
    ];

    const columns = [
        "User",
        "Role",
        "Status",
        "Created At",
        "Updated At",
        "Actions",
    ];

    const startIndex =
        totalUsers === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const endIndex = Math.min(
        currentPage * itemsPerPage,
        totalUsers
    );


    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-3 md:items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                        Manage Accounts
                    </h2>
                    <p className="text-sm text-slate-500">
                        Manage all user accounts
                    </p>
                </div>

                <CustomTooltip content="Add User">
                    <button
                        type="button"
                        onClick={handleCreate}
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-300/50 bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-xl focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    >
                        <Plus size={14} />
                        Add User
                    </button>
                </CustomTooltip>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search name or email"
                            className="w-full border-slate-200 py-5 pl-9 shadow-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-600">
                            Status:
                        </span>

                        <Select
                            value={statusFilter}
                            onValueChange={(v) =>
                                setStatusFilter(v as StatusFilter)
                            }
                        >
                            <SelectTrigger className="w-full md:w-40 border-slate-200 shadow-sm">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>

                                    {statusItems.map((item) => (
                                        <SelectItem
                                            key={item.value}
                                            value={item.value}
                                        >
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
                        <thead className="font-semibold text-white">
                            <tr className="bg-slate-800/95">
                                {columns.map((column) => (
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
                                        colSpan={columns.length}
                                        className="px-3 py-8"
                                    >
                                        <Spinner
                                            text="Loading data"
                                            size={66}
                                        />
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-3 py-8 text-sm  text-destructive"
                                    >
                                        <div className="flex items-center gap-1 justify-center">
                                            <Info size={14} />  {error}

                                            <button
                                                type="button"
                                                onClick={fetchUsers}
                                                className="ml-2 font-medium underline"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-3 py-8"
                                    >
                                        <div className="flex items-center justify-center gap-1 text-center text-xs text-slate-500">
                                            <Info size={13} />
                                            <span>No users found.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                                    >
                                        <td className="whitespace-nowrap px-3 py-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="size-8">
                                                    <AvatarImage
                                                        src="https://github.com/evilrabbit.png"
                                                        alt={user.name}
                                                    />
                                                    <AvatarFallback>
                                                        {user.name.slice(0, 2).toLocaleUpperCase() ?? "US"}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-3">
                                            {user.role === "ADMIN"
                                                ? "Administrator"
                                                : "Staff"}
                                        </td>


                                        <td
                                            className="px-3 py-3 ">
                                            <Badge
                                                variant="outline"
                                                className={user.isActive
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    : "border-red-200 bg-red-50 text-red-700"
                                                }
                                            >
                                                {user.isActive ? (
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


                                        <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                                            {date(user.createdAt)}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                                            {date(user.updatedAt)}
                                        </td>



                                        <td className="whitespace-nowrap px-3 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <CustomTooltip content="See User details">
                                                    <button
                                                        type="button"
                                                        className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                                        aria-label="See User details"
                                                        onClick={() => handleViewDetails(user)}
                                                    >
                                                        <Eye className="size-4" />
                                                    </button>

                                                </CustomTooltip>
                                              
                                              <CustomTooltip content="Edit user">
                                                  <button
                                                    type="button"
                                                    onClick={() => handleEdit(user)}
                                                    className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                                    aria-label="Edit user"
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
                                                                disabled={user.isActive}
                                                                onClick={() => handleActivate(user.id)}
                                                                className="cursor-pointer"
                                                            >
                                                                <UserCheck className="mr-2 size-4" />
                                                                Activate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                disabled={!user.isActive}
                                                                onClick={() => handleDeactivate(user.id)}
                                                                className="cursor-pointer"
                                                            >
                                                                <UserX className="mr-2 size-4" />
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
                                {startIndex}-{endIndex} of {totalUsers}
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

            <UserDetailsDialog
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                userById={selectedUserById}
            />

            <UserFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                mode={mode}
                user={selectedUser}
                onSuccess={async () => {
                    setIsDialogOpen(false);
                    await fetchUsers();
                }}
            />
        </div>
    );
};
