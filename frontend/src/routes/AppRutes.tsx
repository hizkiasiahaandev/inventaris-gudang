import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LoginForm from "@/pages/auth/login";
import MainDashboard from "@/pages/dashboard/Dashboard";
import CompanyProfile from "@/pages/company/Company";
import ManageUser from "@/pages/users/User";
import ManageSupplier from "@/pages/suppliers/Supplier";
import ManageCategories from "@/pages/categories/Categories";
import ManageItems from "@/pages/items/Items";

export default function AppRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<MainDashboard />} />
        <Route path="/users" element={<ManageUser />} />
        <Route path="/categories" element={<ManageCategories />} />
        <Route path="/items" element={<ManageItems />} />
        <Route path="/suppliers" element={<ManageSupplier />} />
        <Route path="/company" element={<CompanyProfile />} />
      </Route>
    </Routes>
  );
}