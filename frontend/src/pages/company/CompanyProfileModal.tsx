
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { companyService } from "@/services/company.service";

import type {
    CompanyProfileService,
    updateCompanyProfile,
    CompanyProfileFormData,
} from "@/types/company.types";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus, Info, Loader, Plus, Save, X } from "lucide-react";
import type { Mode } from "@/types/mode.type";

type CompanyProfileModalProps = {
    mode: Mode;
    isOpen: boolean;
    company?: CompanyProfileService | null;
    onClose: () => void;
    onSuccess: () => void;
};

const emptyForm: CompanyProfileFormData = {
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    description: "",
    logo: "",
};

export default function CompanyProfileModal({
    mode,
    isOpen,
    company,
    onClose,
    onSuccess,
}: CompanyProfileModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [logoPreview, setLogoPreview] = useState<string | null>(company?.logo || null);

    const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setLogoPreview(base64String);
            setValue("logo", base64String, { shouldValidate: true, shouldDirty: true });
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveLogo = () => {
        setLogoPreview(null);
        setValue("logo", "", { shouldValidate: true, shouldDirty: true });
    };


    const {
        register,
        setValue,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CompanyProfileFormData>({
        defaultValues: emptyForm,
    });

    useEffect(() => {
        if (!isOpen) return;

        if (mode === "edit" && company) {
            const existingLogo = company.logo ?? "";
            reset({
                name: company.name ?? "",
                email: company.email ?? "",
                phone: company.phone ?? "",
                address: company.address ?? "",
                website: company.website ?? "",
                description: company.description ?? "",
                logo: company.logo ?? "",
            });
            setLogoPreview(existingLogo || null);
        } else {
            reset(emptyForm);
        }

        setError("");
    }, [isOpen, mode, company, reset]);

    const onSubmit = async (form: CompanyProfileFormData) => {
        setLoading(true);
        setError("");

        const cleanForm = {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            website: form.website.trim(),
            description: form.description.trim(),
            logo: form.logo.trim(),
        };

        try {
            if (mode === "create") {
                await companyService.createCompany({
                    name: cleanForm.name,
                    email: cleanForm.email,
                    phone: cleanForm.phone,
                    address: cleanForm.address,
                    website: cleanForm.website,
                    description: cleanForm.description,
                    logo: cleanForm.logo,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
            } else {
                const payload: updateCompanyProfile = {
                    name: cleanForm.name,
                    email: cleanForm.email,
                    phone: cleanForm.phone,
                    address: cleanForm.address,
                    website: cleanForm.website,
                    description: cleanForm.description,
                    logo: cleanForm.logo,
                };

                await companyService.updateCompanyProfile(payload);
            }

            reset(emptyForm);
            onClose();
            onSuccess();
        } catch (err) {
            console.error(err);
            setError("Failed to save company profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open && !loading) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[90vh] bg-white border border-slate-200/15 overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create"
                            ? "Tambah Company Profile"
                            : "Edit Company Profile"}
                    </DialogTitle>

                    <DialogDescription>
                        {mode === "create"
                            ? "Masukkan informasi perusahaan."
                            : "Perbarui informasi perusahaan."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >

                    <div className="rounded-xl p-4 bg-slate-50/50  transition-colors duration-100 hover:border-slate-400/50">
                        <div className="grid grid-cols-[100px_1fr] items-stretch gap-4">
                            <div className="min-w-0">
                                <div className="relative h-24 w-full overflow-hidden rounded-md border border-dashed border-muted-foreground/40 bg-muted/30">
                                    <label
                                        htmlFor="logoFile"
                                        className="flex h-full w-full cursor-pointer items-center justify-center"
                                    >
                                        {logoPreview ? (
                                            <img
                                                src={logoPreview}
                                                alt="Preview logo"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <ImagePlus size={16} />
                                                <span className="text-xs">Upload</span>
                                            </div>
                                        )}
                                    </label>

                                    {logoPreview && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveLogo}
                                            className="absolute right-1 top-1 z-10 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80"
                                            aria-label="Hapus logo"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>

                                <Input
                                    id="logoFile"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={loading}
                                    onChange={handleLogoFileChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Company Name <span className="text-destructive">*</span>
                                </Label>

                                <Input
                                    id="name"
                                    placeholder="Enter company name"
                                    disabled={loading}
                                    {...register("name", {
                                        required: "Company name is required.",
                                        validate: (value) =>
                                            value.trim().length > 0 ||
                                            "Company name cannot be empty.",
                                    })}
                                />

                                {errors.name && (
                                    <p className="flex items-center gap-1 text-xs text-destructive">
                                        <Info size={13} />
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="company@example.com"
                            disabled={loading}
                            {...register("email", {
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email format.",
                                },
                            })}
                        />

                        {errors.email && (
                            <p className="text-xs flex items-center gap-1 text-destructive">
                                <Info size={13} />
                                {errors.email.message}
                            </p>
                        )}
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>

                        <Input
                            id="phone"
                            placeholder="Enter phone number"
                            disabled={loading}
                            {...register("phone")}
                        />
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>

                        <Input
                            id="address"
                            placeholder="Enter company address"
                            disabled={loading}
                            {...register("address")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>

                        <Input
                            id="website"
                            type="url"
                            placeholder="https://example.com"
                            disabled={loading}
                            {...register("website")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>

                        <Textarea
                            id="description"
                            placeholder="Company description..."
                            rows={3}
                            disabled={loading}
                            {...register("description")}
                        />
                    </div>


                    {error && (
                        <p role="alert" className="text-xs flex items-center gap-1 text-destructive">
                            <Info size={13} />  {error}
                        </p>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={loading}
                            onClick={onClose}
                        >
                            Batal
                        </Button>

                        <Button type="submit" className="bg-slate-800 hover:bg-slate-900 transition-colors duration-300  focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 border border-slate-300/80" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader className="size-4 animate-spin" />
                                    Menyimpan
                                </>
                            ) : mode === "create" ? (
                                <>
                                    <Plus className="size-4" />
                                    Tambah
                                </>
                            ) : (
                                <>
                                    <Save className="size-4" />
                                    Simpan Perubahan
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
