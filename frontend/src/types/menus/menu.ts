import {
  LayoutDashboard,
  Package,
  Boxes,
  Truck,
  ClipboardList,
  Users,
  Building2,
} from "lucide-react";

export type UserRole = "ADMIN" | "STAFF";

export const menuGroups = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        desc: "Ringkasan gudang",
        path: "/dashboard",
        icon: LayoutDashboard,
        roles: ["ADMIN", "STAFF"],
      },
    ],
  },
  {
    title: "Inventory",
    items: [
      {
        label: "Items",
        desc: "Daftar barang",
        path: "/items",
        icon: Package,
        roles: ["ADMIN", "STAFF"],
      },
      {
        label: "Categories",
        desc: "Kelompok barang",
        path: "/categories",
        icon: Boxes,
        roles: ["ADMIN"],
      },
      {
        label: "Suppliers",
        desc: "Data pemasok",
        path: "/suppliers",
        icon: Truck,
        roles: ["ADMIN"],
      },
      {
        label: "Stock Movement",
        desc: "Barang masuk & keluar",
        path: "/stock",
        icon: ClipboardList,
        roles: ["ADMIN", "STAFF"],
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        label: "Users",
        desc: "Akun pengguna",
        path: "/users",
        icon: Users,
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        label: "Company Profile",
        desc: "Info perusahaan",
        path: "/company",
        icon: Building2,
        roles: ["ADMIN"],
      },
    ],
  },
];
