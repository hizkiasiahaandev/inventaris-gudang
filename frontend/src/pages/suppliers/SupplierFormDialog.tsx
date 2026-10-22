import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supplierService } from "@/services/supplier.service";
import type { ErrorResponse } from "@/types/api";
import type { Mode } from "@/types/mode.type";
import type { SupplierFormValues, createSupplier, SupplierData, updateSupplier } from "@/types/supplier.types";
import { ErrorMessage } from "@/utils/error";
import axios from "axios";
import { Loader, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface SupplierFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: Mode;
    suppliers?: SupplierData | null;
    onSuccess: () => void;
};

export default function SupplierFormDialog({
    open,
    onOpenChange,
    mode,
    suppliers,
    onSuccess
}: SupplierFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<SupplierFormValues>({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            contactName: "",
        },
    });


    useEffect(() => {
        if (!open) return;

        if (mode === "edit" && suppliers) {
            reset({
                name: suppliers.name,
                email: suppliers.email,
                phone: suppliers.phone,
                address: suppliers.address,
                contactName: suppliers.contactName,
            });
        } else {
            reset({
                name: "",
                email: "",
                phone: "",
                address: "",
                contactName: "",
            });
        };
    }, [open, mode, suppliers, reset]);

    const onSubmit = async (values: SupplierFormValues) => {
        try {
            setIsSubmitting(true);

            if (mode === "create") {
                const data: createSupplier = {
                    name: values.name.trim(),
                    email: values.email.trim(),
                    phone: values.phone.trim(),
                    address: values.address.trim(),
                    contactName: values.contactName.trim(),
                };

                await supplierService.createSupplier(data);
            } else {
                if (!suppliers) return;

                const data: updateSupplier = {
                    name: values.name.trim(),
                    email: values.email.trim(),
                    phone: values.phone.trim(),
                    address: values.address.trim(),
                    contactName: values.contactName.trim(),
                };

                await supplierService.updateSupplier(data, suppliers.id);
            };

            onOpenChange(false);
            reset();
            onSuccess();;
        } catch (error) {
            console.error("Failed to save supplier: ", error);
            if (axios.isAxiosError<ErrorResponse>(error)) {
                window.alert(
                    error.response?.data.message ?? error.message
                );
            } else if (error instanceof Error) {
                window.alert(error.message);
            } else {
                window.alert(
                    mode === "create"
                        ? "Failed to create supplier."
                        : "Failed to update supplier."
                );
            };
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create"
                            ? "Create supplier"
                            : "Update supplier"
                        }
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Create a new supplier"
                            : "Update the supplier information."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                        <Input
                            id="name"
                            placeholder="Enter supplier name"
                            {...register("name", {
                                required: "Supplier name is required",
                                validate: (value) =>
                                    value.trim().length > 0 ||
                                    "Supplier name is required"
                            })}
                        />
                        {errors.name && (
                            <ErrorMessage message={errors.name.message} />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            placeholder="Enter supplier email"
                            {...register("email")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            placeholder="Enter phone"
                            {...register("phone")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            placeholder="Enter address"
                            {...register("address")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact-name">Contact Name</Label>
                        <Input
                            id="contact-name"
                            placeholder="Enter contact name"
                            {...register("contactName")}
                        />
                    </div>

                    <DialogFooter>
                        <DialogClose
                        render={
                            <Button
                            type="button"
                            variant="outline"
                            disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        }
                        />
                        <Button
                            type="submit"
                            className="bg-slate-800 hover:bg-slate-900 transition-colors duration-300 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 border border-slate-300/80"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader className="size-4 animate-spin" />
                                    Savings...
                                </>
                            ) : mode === "create" ? (
                                <>
                                    <Plus className="size-4" />
                                    Create Supplier
                                </>
                            ) : (
                                <>
                                    <Save className="size-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};