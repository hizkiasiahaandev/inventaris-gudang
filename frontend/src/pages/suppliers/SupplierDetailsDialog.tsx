import Spinner from "@/components/common/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { supplierService } from "@/services/supplier.service";
import type { ErrorResponse } from "@/types/api";
import type { SupplierData } from "@/types/supplier.types";
import { date } from "@/utils/date";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface SupplierDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    supplierId: number | null;
}

export default function SupplierDetailsDialog({
    open,
    onOpenChange,
    supplierId,
}: SupplierDetailsDialogProps) {
    const [supplier, setSupplier] = useState<SupplierData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open || supplierId === null) return;

        const fetchSupplier = async () => {
            try {
                setIsLoading(true);
                setError(null);
                setSupplier(null);

                const response = await supplierService.getSupplierById(supplierId);
                setSupplier(response.data);
            } catch (error) {
                const message = axios.isAxiosError<ErrorResponse>(error)
                    ? error.response?.data.message ||
                    "Failed to fetch supplier."
                    : "An unexpected error occurred.";

                setError(message);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 300);
            }
        };

        fetchSupplier();
    }, [open, supplierId]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Supplier Details</DialogTitle>
                    <DialogDescription>
                        View supplier information.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-8">
                        <Spinner text="Loading supplier details..." />
                    </div>
                ) : error ? (
                    <p
                        role="alert"
                        className="py-6 text-center text-sm  text-destructive"
                    >
                        {error}
                    </p>
                ) : supplier ? (
                    <div className="space-y-5 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500">
                                    Supplier ID
                                </p>
                                <p className="text-lg font-semibold">
                                    #{supplier.id}
                                </p>
                            </div>

                            <Badge
                                variant="outline"
                                className={
                                    supplier.isActive
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                        : "border-red-200 bg-red-50 text-red-700"
                                }
                            >
                                {supplier.isActive ? (
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
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Supplier Name
                                </p>
                                <p className="font-medium">
                                    {supplier.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Contact Name
                                </p>
                                <p className="font-medium">
                                    {supplier.contactName || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Email
                                </p>
                                <p className="wrap-break-word text-sm font-medium">
                                    {supplier.email || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Phone
                                </p>
                                <p className="font-medium">
                                    {supplier.phone || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Address
                                </p>
                                <p className="whitespace-pre-wrap wrap-break-word text-sm">
                                    {supplier.address || "-"}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Created At
                                </p>
                                <p className="text-sm font-medium">
                                    {supplier.createdAt ? date(supplier.createdAt) : "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Updated At
                                </p>
                                <p className="text-sm font-medium">
                                    {supplier.updatedAt ? date(supplier.updatedAt) : "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}
                <DialogFooter>
                    <DialogClose
                    render={
                        <Button
                        type="button"
                        variant="outline"
                        >
                            Cancel
                        </Button>
                    }
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};