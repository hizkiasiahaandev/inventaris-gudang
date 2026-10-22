import Spinner from "@/components/common/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { itemService } from "@/services/item.service";
import type { ErrorResponse } from "@/types/api";
import type { ItemsData } from "@/types/item.types";
import { date } from "@/utils/date";
import { ErrorMessage } from "@/utils/error";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ItemDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    itemId: number | null;
}

export default function ItemDetailsDialog({
    open,
    onOpenChange,
    itemId,
}: ItemDetailsDialogProps) {
    const [item, setItem] = useState<ItemsData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open || itemId === null) {
            return;
        }


        const fetchItem = async () => {
            try {
                setIsLoading(true);
                setError(null);
                setItem(null);

                const response = await itemService.getItemById(itemId);

                setItem(response.data);
            } catch (error) {
                const message = axios.isAxiosError<ErrorResponse>(error)
                    ? error.response?.data.message ||
                    "Failed to fetch item."
                    : "An unexpected error occurred.";

                setError(message);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 300);
            };
        };

        fetchItem();
    }, [open, itemId]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Item Details</DialogTitle>
                    <DialogDescription>
                        View item information and related details.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-8">
                        <Spinner text="Loading item details..." />
                    </div>
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : item ? (
                    <div className="space-y-5 py-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Item ID
                                    </p>
                                    <p className="text-lg font-semibold">
                                        #{item.id}
                                    </p>
                                </div>

                                <Badge
                                    variant="outline"
                                    className={item.isActive
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                        : "border-red-200 bg-red-50 text-red-700"
                                    }
                                >
                                    {item.isActive ? (
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

                            <div>
                                <p className="text-sm  text-slate-500">
                                    Item Name
                                </p>
                                <p className="font-medium">
                                    {item.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    SKU
                                </p>
                                <p className="font-medium">
                                    {item.sku || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Category
                                </p>
                                <p className="font-medium">
                                    {item.category?.name ?? "-"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    ID: {item.categoryId}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Supplier
                                </p>
                                <p className="font-medium">
                                    {item.supplier?.name ?? "-"}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    ID: {item.supplierId}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Stock
                                </p>
                                <p className="font-semibold">
                                    {item.stock}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Minimum Stock
                                </p>
                                <p className="font-semibold">
                                    {item.minimumStock}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Purchase Price
                                </p>
                                <p className="font-medium">
                                    Rp. {item.purchasePrice}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Created By
                                </p>
                                <p className="font-medium">
                                    {item.createdBy?.name ?? "-"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    ID: {item.createdById ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Updated By
                                </p>
                                <p className="font-medium">
                                    {item.updatedBy?.name ?? "-"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    ID: {item.updatedById ?? "-"}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2  gap-4">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Created At
                                </p>
                                <p className="text-sm font-medium">
                                    {date(item.createdAt)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Updated At
                                </p>
                                <p className="text-sm font-medium">
                                    {date(item.updatedAt)}
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
}
