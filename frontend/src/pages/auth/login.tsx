import Footer from "@/components/layout/Footer";
import { companyService } from "@/services/company.service";
import { userService } from "@/services/user.service";
import type { ErrorResponse } from "@/types/api";
import type { CompanyProfile } from "@/types/company.types";
import { useForm } from "react-hook-form";
import type { loginData } from "@/types/user.types";
import axios from "axios";
import { Box, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Info, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const [company, setCompany] = useState<CompanyProfile | null>(null);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<loginData>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        const getCommpanyProfile = async () => {
            try {
                const response = await companyService.getCompanyProfile();

                setCompany(response.data);
            } catch (error) {
                console.error("Failed to get company profile:", error);
            }
        };

        getCommpanyProfile();
    }, []);

    const onSubmit = async (data: loginData) => {
        setFormError("");
        setLoading(true);
        try {
            const response = await userService.login({
                email: data.email,
                password: data.password,
            });
            console.log(response);

            navigate("/dashboard");
        } catch (error) {
            if (axios.isAxiosError<ErrorResponse>(error)) {
                setFormError(
                    error.response?.data.message || "Email atau password salah"
                );
            } else {
                setFormError("Terjadi kesalahan. Silakan coba lagi");
            }
        } finally {
            setLoading(false);
        };
    };



    return (
        <div className="h-screen flex items-center justify-center px-6 bg-slate-50">
            <div className="max-w-sm  w-full shadow-lg rounded-lg border-slate-200/15 border bg-white/80">
                <div className="flex items-center flex-col justify-center mb-4 p-4">
                    <div className="flex size-14 items-center justify-center  overflow-hidden rounded-lg bg-slate-800 text-white shadow-sm">
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
                    <div className="text-center">
                        <h1 className="text-xl font-bold text-slate-800">
                            {company?.name || "Catatan gudang"}
                        </h1>
                        <p className="text-[14px] text-slate-600">
                            {company?.description || "Masuk untuk melanjutkan"}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-4 space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                            Email
                        </label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="nama@email.com"
                                {...register("email", {
                                    required: "Email wajib diisi"
                                })}
                                className="w-full pl-9 pr-3 py-3 text-sm border duration-300 border-slate-200/75 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-800/95 focus:border-slate-800 shadow-sm"
                            />


                        </div>
                        {errors.email && (
                            <p className="mt-1 flex gap-0.5 items-center text-xs text-destructive">
                                <Info size={12} className="shrink-0" />  {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Masukkan password"
                                {...register("password", {
                                    required: "Password wajib diisi"
                                })}
                                className="w-full pl-9 pr-10 py-3 text-sm border duration-300 border-slate-200/75 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-800/95 focus:border-slate-800 shadow-sm"
                            />


                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-700"
                                title={showPassword ? "Sembunyikan password" : "Lihat password"}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>

                        </div>
                        {errors.password && (
                            <p className="mt-1 flex items-center gap-0.5 text-xs text-destructive">
                                <Info size={12} className="shrink-0" />  {errors.password.message}
                            </p>
                        )}
                    </div>

                    {formError && (
                        <div className="flex items-start gap-1.5 bg-red-50 rounded-md px-3 border border-red-200 py-2 text-sm text-red-700">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <span>{formError}</span>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium rounded-md border-slate-600/50 border bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50 duration-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 shadow-sm shadow-slate-700/15 transition-colors"
                    >
                        {loading ? (
                            <Loader size={16} className="animate-spin" />
                        ) : (
                            <LogIn size={16} />
                        )}

                        {loading ? "Memproses" : "Masuk"}
                    </button>
                </form>
                <Footer />
            </div>
        </div>
    );
}