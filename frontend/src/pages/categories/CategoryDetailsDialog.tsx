
import Spinner from "@/components/common/Spinner";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { categoryService } from "@/services/category.service";
import type { ErrorResponse } from "@/types/api";
import type { Category } from "@/types/category.types";
import { date } from "@/utils/date";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface CategoryDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categoryId: number | null;
}

export default function CategoryDetailsDialog({
    open,
    onOpenChange,
    categoryId,
}: CategoryDetailsDialogProps) {
    const [category, setCategory] = useState<Category | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open || categoryId === null) return;

        const fetchCategory = async () => {
            try {
                setIsLoading(true);
                setError(null);
                setCategory(null);

                const data = await categoryService.getCategoryById(categoryId);
                setCategory(data.data);
            } catch (error) {
                const message = axios.isAxiosError<ErrorResponse>(error)
                    ? error.response?.data.message ||
                    "Failed to fetch category."
                    : "An unexpected error occurred.";

                setError(message);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 300);
            };
        };

        fetchCategory();
    }, [open, categoryId]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Category Details</DialogTitle>
                    <DialogDescription>
                        View category information.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-8">
                        <Spinner text="Loading category details..." />
                    </div>
                ) : error ? (
                    <p
                        role="alert"
                        className="py-6 text-center text-sm text-red-500"
                    >
                        {error}
                    </p>
                ) : category ? (
                    <div className="space-y-5 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500">
                                    Category ID
                                </p>
                                <p className="text-lg font-semibold">
                                    #{category.id}
                                </p>
                            </div>

                            <Badge
                                variant="outline"
                                className={
                                    category.isActive
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                        : "border-red-200 bg-red-50 text-red-700"
                                }
                            >
                                {category.isActive ? (
                                    <>
                                        <CheckCircle />
                                        Active
                                    </>
                                ) : (
                                    <>
                                        <XCircle />
                                        InActive
                                    </>
                                )}
                            </Badge>
                        </div>

                        <Separator />


                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Category Name
                                </p>
                                <p className="font-medium">
                                    {category.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Description
                                </p>
                                <p className="whitespace-pre-wrap wrap-break-word text-sm">
                                    {category.description || "-"}
                                </p>
                            </div>
                        </div>

                        <Separator />


                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Created At
                                </p>
                                <p className="text-sm font-medium">
                                    {date(category.createdAt)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Updated At
                                </p>
                                <p className="text-sm font-medium">
                                    {date(category.updatedAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
