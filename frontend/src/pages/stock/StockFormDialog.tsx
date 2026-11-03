import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { itemService } from "@/services/item.service";
import { stockService } from "@/services/stock.service";
import type { ErrorResponse } from "@/types/api";
import type { ItemsData } from "@/types/item.types";
import { type StockMovementValues, type CreateStockMovement } from "@/types/stock.types";
import { ErrorMessage } from "@/utils/error";
import axios from "axios";
import { ArrowDownToLine, ArrowUpFromLine, Loader, Package, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface StockMovementsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
};

export default function StockMovementsDialog({
    open,
    onOpenChange,
    onSuccess
}: StockMovementsDialogProps) {
    const [submitting, setSubmitting] = useState(false);
    const [items, setItems] = useState<ItemsData[]>([]);

    const fetchItems = async () => {
        try {
            const response = await itemService.getItems({
                page: 1,
                limit: 100
            });
            setItems(response.data.data);
        } catch (error) {
            console.error("Failed to fetch items", error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<StockMovementValues>({
        defaultValues: {
            itemId: undefined,
            type: "IN",
            quantity: undefined,
            note: "",
        },
    });

    useEffect(() => {
        if (!open) return;

        reset({
            itemId: 0,
            type: "IN",
            quantity: 0,
            note: "",
        });
    }, [open, reset]);

    const onSubmit = async (values: StockMovementValues) => {
        try {
            setSubmitting(true);

            const data: CreateStockMovement = {
                itemId: values.itemId,
                type: values.type,
                quantity: values.quantity,
                note: values.note.trim(),
            };

            await stockService.createStockMovement(data);

            onOpenChange(false);
            reset();
            onSuccess?.();
        } catch (error) {
            console.error("Failed to create stock movements", error);
            if (axios.isAxiosError<ErrorResponse>(error)) {
                window.alert(
                    error.response?.data.message ?? error.message
                );
            } else if (error instanceof Error) {
                window.alert(error.message);
            } else {
                window.alert(
                    "Failed to create stock movements",
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const activeItems = items.filter(
        (item) => item.isActive !== false,
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create Stock
                    </DialogTitle>
                    <DialogDescription>
                        Create Stock movements
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4">

                    <div className="space-y-2">
                        <Label htmlFor="itemId">
                            ItemId <span className="text-destructive">*</span>
                        </Label>

                        <Controller
                            name="itemId"
                            control={control}
                            rules={{
                                required: "ItemId is required",
                                validate: (v) =>
                                    (Number.isInteger(v) && v > 0) ||
                                    "Please select item"
                            }}
                            render={({ field }) => (
                                <Select
                                    value={field.name ? String(field.value) : ""}
                                    onValueChange={(v) => (
                                        field.onChange(Number(v))
                                    )}
                                    disabled={submitting}
                                >
                                    <SelectTrigger id="itemId" className="w-full">
                                        <SelectValue placeholder="Select item" />
                                    </SelectTrigger>

                                    <SelectContent className="w-full overflow-x-auto">
                                        <SelectGroup>
                                            <SelectLabel>Select Item</SelectLabel>
                                            {activeItems.map((item) => (
                                                <SelectItem key={item.id} value={String(item.id)}>
                                                    #{item.id} - {item.name}
                                                </SelectItem>
                                            ))}
                                            <SelectSeparator />
                                            <SelectLabel>Total Items: {activeItems.length}</SelectLabel>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        {errors.itemId && (
                            <ErrorMessage
                                message={errors.itemId.message}
                            />
                        ) }
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">
                            Type <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <div className="grid grid-cols-2 gap-4">
                                    {(["IN", "OUT"] as const).map((value) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => field.onChange(value)}
                                            className={`rounded-lg inline-flex justify-center items-center gap-1 border p-3 font-semibold transition-colors ${field.value === value
                                                ? value === "IN"
                                                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                                                    : "border-red-600 bg-red-50 text-red-700"
                                                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                                                }`}
                                        >
                                            {value === "IN" ? (
                                                <ArrowDownToLine size={18} />
                                            ) : (
                                                <ArrowUpFromLine size={18} />
                                            )}
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            )}
                        />
                        
                        {errors.type && (
                            <ErrorMessage
                                message={errors.type.message}
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quantity">
                            Quantity <span className="text-destructive">*</span>
                        </Label>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex w-[30%] items-center justify-center gap-1 rounded-l-md border-r bg-slate-800 text-xs text-slate-50">
                                <Package size={16} />
                                Qty
                            </div>

                            <Input
                                id="quantity"
                                type="number"
                                min={0}
                                step={1}
                                placeholder="0"
                                disabled={submitting}
                                className="pl-[33%]"
                                {...register("quantity", {
                                    required: "Quantity is required",
                                    valueAsNumber: true,
                                    min: {
                                        value: 0,
                                        message: "Quantity cannot be negative"
                                    },
                                    validate: (value) =>
                                        Number.isInteger(value) ||
                                        "Quantity must be an integer"
                                })}
                            />
                        </div>

                        {errors.quantity && (
                            <ErrorMessage
                                message={errors.quantity.message}
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note">
                            Note<span>(Opsional)</span>
                        </Label>

                        <Textarea
                            id="note"
                            placeholder="Enter note..."
                            rows={4}
                            {...register("note")}
                        />

                      
                    </div>
                      <DialogFooter>
                            <DialogClose
                                render={
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </Button>
                                }
                            />
                            <Button
                                type="submit"
                                className="bg-slate-800 inline-flex justify-center items-center gap-1 hover:bg-slate-900 transition-colors duration-300 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 border border-slate-300/80"
                                disabled={submitting}
                           >
                                {submitting ?(
                                    <>
                                    <Loader size={16} className="animate-spin" />
                                    Savings...
                                    </>
                                ): (
                                    <>
                                    <Plus size={16} />
                                    Create Stock
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                </form>
                
            </DialogContent>
        </Dialog>
    )
}

