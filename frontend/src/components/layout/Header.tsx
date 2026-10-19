import { useLocation, useNavigate } from "react-router-dom";
import { menuGroups } from "@/types/menus/menu";
import { Menu, ChevronDown, UserRound, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "@/types/user.types";
import { userService } from "@/services/user.service";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({
    onMenuClick,
}: HeaderProps) {
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await userService.logout();
            setUser(null);
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await userService.getMe();
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        fetchUser();
    }, []);

    const currentMenu = menuGroups
        .flatMap((group) => group.items)
        .find((item) => item.path === location.pathname);

    return (
        <header className="h-20 border-b border-slate-200/20 bg-white px-4 lg:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="lg:hidden flex size-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 transition"
                    aria-label="Open sidebar"
                >
                    <Menu size={22} />
                </button>

                <div className="leading-tight">
                    <h1 className="text-base font-bold text-slate-800 tracking-tight">
                        {currentMenu?.label || "InvenTrack"}
                    </h1>

                    <p className="text-xs text-slate-400 mt-0.5">
                        {currentMenu?.desc ||
                            "Inventory Management System"}
                    </p>
                </div>
            </div>

            {/* User Dropdown */}
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger render={<button
                        type="button"
                        className="flex items-center gap-3 rounded-xl px-2 hover:bg-slate-50 transition outline-none"
                    >
                        <Avatar className="size-10">
                            <AvatarImage
                                src="https://github.com/evilrabbit.png"
                                alt={user?.name ?? "User avatar"}
                            />
                            <AvatarFallback>
                                {user?.name?.slice(0, 2).toUpperCase() ?? "US"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="hidden sm:block leading-tight text-left">
                            <p className="text-sm font-medium text-slate-800">
                                {user?.name ?? "Loading..."}
                            </p>
                            <p className="text-xs text-slate-400">
                                {user?.role === "ADMIN"
                                    ? "ADMINISTRATOR"
                                    : user?.role === "STAFF"
                                        ? "STAFF"
                                        : "Loading"
                                }

                            </p>
                        </div>

                        <ChevronDown
                            size={16}
                            className="text-slate-400"
                        />
                    </button>}>

                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-45"
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>
                                <div className="flex flex-col gap-1">
                                    <span>{user?.name ?? "User"}</span>
                                    <span className="text-xs font-normal text-muted-foreground">
                                        {user?.email ?? ""}
                                    </span>
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={() => navigate("/profile")}
                            className="cursor-pointer"
                        >
                            <UserRound className="mr-2 size-4" />
                            Profile
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                            <LogOut className="mr-2 size-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}