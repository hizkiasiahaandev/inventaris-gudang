import Spinner from "@/components/common/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { stockService } from "@/services/stock.service";
import type { ErrorResponse } from "@/types/api";
import type { StockMovementData } from "@/types/stock.types";
import { date } from "@/utils/date";
import { ErrorMessage } from "@/utils/error";
import axios from "axios";
import { CheckCircle, PackageMinus, PackagePlus, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface StockDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    stockId: number | null;
};


export default function StockDetailsDialog({
    open,
    onOpenChange,
    stockId
}: StockDetailsDialogProps) {
    const [stock, setStock] = useState<StockMovementData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (!open || stockId === null) {
            return
        };

        const fetchStock = async () => {
            try {
                setLoading(true);
                setError("");
                setStock(null);

                const response = await stockService.getStockMovementsById(stockId);
                setStock(response.data);
            } catch (error) {
                const message = axios.isAxiosError<ErrorResponse>(error)
                    ? error.response?.data.message ||
                    "Failed to fetch stock"
                    : "An unexpected error occurred"

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 300);
            };
        };

        fetchStock();
    }, [open, stockId]);


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Stock Details
                    </DialogTitle>
                    <DialogDescription>
                        View stock information and related details.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="py-8">
                        <Spinner text="Loading stock details..." />
                    </div>
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : stock ? (
                    <div className="space-y-5">
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-slate-500">
                                    Stock ID
                                </p>
                                <p className="text-lg font-semibold">
                                    #{stock.item.id}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    SKU
                                </p>
                                <p className="text-lg font-semibold">
                                    {stock.item.sku}
                                </p>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1.5">
                                        Type
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className={stock.type === "IN"
                                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                            : "border border-red-200 bg-red-50 text-red-700"
                                        }
                                    >
                                        {stock.type === "IN" ? (
                                            <>
                                                <PackagePlus />
                                                IN
                                            </>
                                        ) : (
                                            <>
                                                <PackageMinus />
                                                OUT
                                            </>
                                        )}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1.5">
                                        Status
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className={stock.status === "COMPLETED"
                                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                            : "border border-e-red-200 bg-red-50 text-red-700"
                                        }
                                    >
                                        {stock.status === "COMPLETED" ? (
                                            <>
                                                <CheckCircle />
                                                Completed
                                            </>
                                        ) : (
                                            <>
                                                <XCircle />
                                                Completed
                                            </>
                                        )}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Note
                                </p>
                                <p className="font-medium">
                                    {stock.note}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Quantity
                                </p>
                                <p className="font-medium">
                                    {Number(stock.quantity)}
                                </p>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-500">
                                        CreatedById
                                    </p>
                                    <p className="font-medium">
                                        {stock.createdBy.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">CancelledById</p>
                                    <p className="font-medium">
                                        {stock.cancelledBy?.name ?? "-"}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    CreatedAt
                                </p>
                                <p className="font-medium">
                                    {stock.createdAt ? date(stock.createdAt) : ""}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    UpdatedAt
                                </p>
                                <p className="font-medium">
                                    {stock.updatedAt ? date(stock.updatedAt) : ""}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    CancelledAt
                                </p>
                                <p className="font-medium">
                                    {stock.cancelledAt ? date(stock.cancelledAt) : "-"}
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
    )
}