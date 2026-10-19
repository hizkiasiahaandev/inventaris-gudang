import { companyService } from "@/services/company.service";
import type { ErrorResponse } from "@/types/api";
import type { CompanyProfile } from "@/types/company.types";
import { menuGroups, type UserRole } from "@/types/menus/menu";
import axios from "axios";
import { Box } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Footer from "./Footer";
import { userService } from "@/services/user.service";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function Sidebar({
    open,
    onClose,
}: SidebarProps) {
    const [company, setCompany] = useState<CompanyProfile | null>(null);
    const [userRole, setUserRole] = useState<UserRole | null>(null);

    useEffect(() => {
        const getUserByRole = async () => {
            try {
                const response = await userService.getMe();
                const role = response.data.role;

                if (role === "ADMIN" || role === "STAFF") {
                    setUserRole(role);
                }
            } catch (error) {
                console.error("Failed to get current user", error);
            }
        };

        getUserByRole();
    }, []);

    const filteredMenuGroups = menuGroups
        .map((group) => ({
            ...group,
            items: group.items.filter(
                (item) => userRole !== null && item.roles.includes(userRole)
            ),
        }))
        .filter((group) => group.items.length > 0);



    useEffect(() => {
        const getCompanyProfile = async () => {
            try {
                const response = await companyService.getCompanyProfile();

                setCompany(response.data);
            } catch (error) {
                if (axios.isAxiosError<ErrorResponse>(error)) {
                    console.error(
                        error.response?.data.message ||
                        "Failed to get company profile"
                    );
                }
            }
        };

        getCompanyProfile();
    }, []);

    return (
        <aside
            className={`
                fixed inset-y-0 left-0 z-50
                w-75
                border-r border-slate-200/70
                bg-white
                flex flex-col
                transform transition-transform duration-300 ease-in-out
                lg:static lg:translate-x-0
                ${open ? "translate-x-0" : "-translate-x-full"}
            `}
        >
            <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100">
                <div className="flex size-12 items-center justify-center overflow-hidden rounded-lg  bg-slate-800 text-white shadow-sm">
                    {company?.logo ? (
                        <img
                            src={company.logo}
                            alt={company.name}
                            className="size-full object-cover"
                        />
                    ) : (
                        <Box size={22} />
                    )}
                </div>

                <div className="leading-tight">
                    <h1 className="text-base font-bold text-slate-800 tracking-tight">
                        {company?.name || "Catatan gudang"}
                    </h1>

                    <p className="text-xs text-slate-400">
                        {company?.description ||
                            "Inventory Management System"}
                    </p>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-7">
                {filteredMenuGroups.map((group) => (
                    <div key={group.title}>
                        <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                            {group.title}
                        </p>

                        <div className="space-y-1.5">
                            {group.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={onClose}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${isActive
                                                ? "bg-slate-800 text-slate-50/90 font-semibold"
                                                : "text-slate-600 font-medium hover:bg-slate-100/70 hover:text-slate-900"
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <Icon
                                                    size={18}
                                                    className={`shrink-0 transition-colors ${isActive ? "text-slate-50" : "text-slate-500"
                                                        }`}
                                                />

                                                <div className="flex-1 min-w-0">
                                                    <span className="block truncate leading-snug">{item.label}</span>
                                                    {item.desc && (
                                                        <span className={`block truncate text-xs font-normal mt-0.5 ${isActive ? "text-slate-50/70" : "text-slate-400"
                                                            }`}>
                                                            {item.desc}
                                                        </span>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>
            <Footer />
        </aside>
    );
};