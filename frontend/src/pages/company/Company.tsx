import Spinner from "@/components/common/Spinner";
import { companyService } from "@/services/company.service";
import type { CompanyProfileService } from "@/types/company.types"
import { date } from "@/utils/date";
import { Box, Edit, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import CompanyProfileModal from "./CompanyProfileModal";
import type { Mode } from "@/types/mode.type";

export default function CompanyProfile() {
    const [company, setCompany] = useState<CompanyProfileService | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<Mode>("create");

    function getWebsiteHostname(website: string) {
        try {
            return new URL(
                website.startsWith("http")
                    ? website
                    : `http://${website}`
            ).hostname
        } catch {
            return website
        }
    };

    const getCompanyProfile = async () => {
        try {
            const response = await companyService.getCompanyProfile();
            setCompany(response.data ?? null);
        } catch (error) {
            console.error("Failed to get company profile:", error);
            setCompany(null);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            },  300);
        }
    };

    useEffect(() => {
        void getCompanyProfile();
    }, []);

    const handleAdd = () => {
        setMode("create");
        setIsModalOpen(true);
    }

    const handleEdit = () => {
        setMode("edit");
        setIsModalOpen(true);
    }


    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Company Profile</h2>
                    <p className="text-[14px] text-slate-500">Setting your company profile</p>
                </div>
                {!company && (
                    <button
                        onClick={handleAdd}
                        className="inline-flex items-center gap-2 px-4 py-2 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 text-sm font-medium text-white bg-slate-800 shadow-slate-600/15 border-slate-300/50 border hover:shadow-xl shadow-sm  rounded-lg">
                        <Plus size={14} />
                        Add Company
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center min-h-72 justify-center">
                    <Spinner text="Loading company profile" size={66} />
                </div>
            ) : company ? (
                <div className="bg-white border shadow-sm border-slate-200 transition-all hover:shadow-sm p-6 rounded-xl">
                    <div className="flex items-start gap-5 pb-6 border-b border-gray-200">
                        <div className="flex size-16 items-center justify-center overflow-hidden rounded-lg bg-slate-800 text-white shadow-sm">
                            {company?.logo ? (
                                <img
                                    src={company.logo}
                                    alt={company.name || company.logo}
                                    className="size-full object-cover"
                                />
                            ) : (
                                <Box size={30} />
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 capitalize mb-1">{company.name || "Catatan gudang"}</h3>
                                    <p className="text-sm text-slate-500">
                                        {company.website ? getWebsiteHostname(company.website) : "-"}
                                    </p>
                                </div>
                                <button onClick={handleEdit} className="inline-flex focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 items-center border border-slate-300/50 gap-2 px-3 py-1.5 text-sm font-medium text-white bg-slate-800 hover:shadow-xl shadow-sm shadow-slate-600/15 transition duration-300 rounded-lg">
                                    <Edit size={14} />
                                    Edit
                                </button>
                            </div>
                            {company.description && (
                                <p className="text-sm text-slate-600 leading-relaxed mt-3">
                                    {company.description || "Inventory Management System"}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                        {company.email && (
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Email</p>
                                <p className="text-sm text-slate-800">{company.email || "-"}</p>
                            </div>
                        )}

                        {company.phone && (
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Phone</p>
                                <p className="text-sm text-slate-800">{company.phone || "-"}</p>
                            </div>
                        )}

                        {company.website && (
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Website</p>

                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    {company.website || "-"}
                                </a>
                            </div>
                        )}

                        {company.address && (
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Address</p>
                                <p className="text-sm text-slate-800">{company.address || "-"}</p>
                            </div>
                        )}

                        {company.createdAt && (
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Created At</p>
                                <p className="text-sm text-slate-800">{date(company.createdAt || "-")}</p>
                            </div>
                        )}

                        {company.updatedAt && (
                            <div>
                                <p className="text-xs font-medium uppercase text-slate-400 tracking-wide mb-1">Updated At </p>
                                <p className="text-sm text-slate-800">{date(company.updatedAt || "-")}</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border border-gray-200 border-dashed text-center shadow-sm bg-white px-6 py-16">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-gray-100 text-slate-400">
                        <Box size={16} />
                    </div>

                    <h3 className="text-base font-semibold text-slate-800">
                        No Company Profile
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                        Company information has not been added yet.
                        Create a company profile to get started.
                    </p>
                </div>
            )}

            <CompanyProfileModal
                mode={mode}
                isOpen={isModalOpen}
                company={company}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    void getCompanyProfile();
                }}
            />
        </div>
    )
};

