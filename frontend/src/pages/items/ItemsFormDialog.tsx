import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { itemService } from "@/services/item.service";
import { categoryService } from "@/services/category.service";
import { supplierService } from "@/services/supplier.service";

import type { ErrorResponse } from "@/types/api";
import type {
    ItemsFormValues,
    ItemsData,
    CreateItem,
    UpdateItem,
} from "@/types/item.types";
import type { Mode } from "@/types/mode.type";

import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { Category } from "@/types/category.types";
import type { SupplierData } from "@/types/supplier.types";
import { ErrorMessage } from "@/utils/error";
import { Package, PackageCheck, UserRound, CalendarClock, Loader, Plus, Save, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { date } from "@/utils/date";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface ItemsFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: Mode;
    items?: ItemsData | null;
    onSuccess: () => void;
}

export default function ItemsFormDialog({
    open,
    onOpenChange,
    mode,
    items,
    onSuccess,
}: ItemsFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);

    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierData[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<ItemsFormValues>({
        defaultValues: {
            sku: "",
            name: "",
            description: "",
            stock: undefined,
            minimumStock: undefined,
            unit: "",
            purchasePrice: undefined,
            categoryId: undefined,
            supplierId: undefined,
        },
    });

    useEffect(() => {
        if (!open) return;

        const fetchOptions = async () => {
            try {
                setIsLoadingOptions(true);

                const [categoryData, supplierData] = await Promise.all([
                    categoryService.getCategories({
                        page: 1,
                        limit: 100,
                    }),
                    supplierService.getSuppliers({
                        page: 1,
                        limit: 100,
                    }),
                ]);

                setCategories(categoryData.data.data);
                setSuppliers(supplierData.data.data);
            } catch (error) {
                console.error("Failed to fetch options:", error);
                window.alert("Failed to load categories and suppliers.");
            } finally {
                setIsLoadingOptions(false);
            }
        };

        void fetchOptions();
    }, [open]);


    useEffect(() => {
        if (!open) return;

        if (mode === "edit" && items) {
            reset({
                sku: items.sku,
                name: items.name,
                description: items.description ?? "",
                stock: items.stock,
                minimumStock: items.minimumStock,
                unit: items.unit,
                purchasePrice: Number(items.purchasePrice),
                categoryId: items.categoryId,
                supplierId: items.supplierId,
            });
        } else {
            reset({
                sku: "",
                name: "",
                description: "",
                stock: undefined,
                minimumStock: undefined,
                unit: "",
                purchasePrice: undefined,
                categoryId: undefined,
                supplierId: undefined,
            });
        }
    }, [open, mode, items, reset]);

    const onSubmit = async (values: ItemsFormValues) => {
        try {
            setIsSubmitting(true);

            if (mode === "create") {
                const data: CreateItem = {
                    sku: values.sku.trim().toUpperCase(),
                    name: values.name.trim(),
                    description: values.description.trim(),
                    stock: values.stock,
                    minimumStock: values.minimumStock,
                    unit: values.unit.trim(),
                    purchasePrice: values.purchasePrice,
                    categoryId: values.categoryId,
                    supplierId: values.supplierId,
                };

                await itemService.createItem(data);
            } else {
                if (!items) return;

                const data: UpdateItem = {
                    sku: values.sku.trim().toUpperCase(),
                    name: values.name.trim(),
                    description: values.description.trim(),
                    minimumStock: values.minimumStock,
                    unit: values.unit.trim(),
                    purchasePrice: values.purchasePrice,
                    categoryId: values.categoryId,
                    supplierId: values.supplierId,
                };


                await itemService.updateItem(data, items.id);
            }

            onOpenChange(false);
            reset();
            onSuccess();
        } catch (error) {
            console.error("Failed to save item:", error);

            if (axios.isAxiosError<ErrorResponse>(error)) {
                window.alert(
                    error.response?.data.message ?? error.message
                );
            } else if (error instanceof Error) {
                window.alert(error.message);
            } else {
                window.alert(
                    mode === "create"
                        ? "Failed to create item."
                        : "Failed to update item."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const activeSupplier = suppliers.filter(
        (supplier) => supplier.isActive !== false ||
            supplier.id === items?.supplierId
    );

    const categoryActive = categories.filter(
        (category) => category.isActive !== false ||
            category.id === items?.categoryId
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create"
                            ? "Create Item"
                            : "Update Item"}
                    </DialogTitle>

                    <DialogDescription>
                        {mode === "create"
                            ? "Create a new inventory item."
                            : "Update the item information."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="sku">
                            SKU <span className="text-destructive">*</span>
                        </Label>

                        <Input
                            id="sku"
                            placeholder="Enter item SKU"
                            disabled={isSubmitting}
                            className="placeholder:normal-case uppercase"
                            {...register("sku", {
                                required: "SKU is required",
                                validate: (value) =>
                                    value.trim().length > 0 ||
                                    "SKU is required",
                            })}
                        />

                        {errors.sku && (
                            <ErrorMessage message={errors.sku.message} />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Name <span className="text-destructive">*</span>
                        </Label>

                        <Input
                            id="name"
                            placeholder="Enter item name"
                            disabled={isSubmitting}
                            {...register("name", {
                                required: "Item name is required",
                                validate: (value) =>
                                    value.trim().length > 0 ||
                                    "Item name is required",
                            })}
                        />

                        {errors.name && (
                            <ErrorMessage message={errors.name.message} />
                        )}
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="stock">
                                Stock <span className="text-destructive">*</span>
                            </Label>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex w-[40%] items-center justify-center gap-1 rounded-l-md border-r bg-slate-800 text-xs text-slate-50">
                                    <Package size={16} />
                                    Qty
                                </div>

                                <Input
                                    id="stock"
                                    type="number"
                                    min={0}
                                    step={1}
                                    placeholder="0"
                                    disabled={isSubmitting || mode === "edit"}
                                    className="pl-[44%]"
                                    {...register("stock", {
                                        required: "Stock is required",
                                        valueAsNumber: true,
                                        min: {
                                            value: 0,
                                            message: "Stock cannot be negative",
                                        },
                                        validate: (value) =>
                                            Number.isInteger(value) ||
                                            "Stock must be an integer",
                                    })}
                                />
                            </div>

                            {mode === "edit" && (
                                <p className="text-xs text-muted-foreground">
                                    Use Stock Movement to change stock.
                                </p>
                            )}

                            {errors.stock && (
                                <ErrorMessage message={errors.stock.message} />
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="minimumStock">
                                Minimum Stock{" "}
                                <span className="text-destructive">*</span>
                            </Label>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex w-[50%] items-center justify-center gap-1 rounded-l-md border-r bg-slate-800 text-xs text-slate-50">
                                    <PackageCheck size={16} />
                                    Min Qty
                                </div>

                                <Input
                                    id="minimumStock"
                                    type="number"
                                    min={0}
                                    step={1}
                                    placeholder="0"
                                    disabled={isSubmitting}
                                    className="pl-[52%]"
                                    {...register("minimumStock", {
                                        required: "Minimum stock is required",
                                        valueAsNumber: true,
                                        min: {
                                            value: 0,
                                            message: "Minimum stock cannot be negative",
                                        },
                                        validate: (value) =>
                                            Number.isInteger(value) ||
                                            "Minimum stock must be an integer",
                                    })}
                                />
                            </div>

                            {errors.minimumStock && (
                                <ErrorMessage
                                    message={errors.minimumStock.message}

                                />
                            )}
                        </div>
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="unit">
                            Unit <span className="text-destructive">*</span>
                        </Label>

                        <Input
                            id="unit"
                            placeholder="e.g. pcs, box, kg"
                            disabled={isSubmitting}
                            {...register("unit", {
                                required: "Unit is required",
                                validate: (value) =>
                                    value.trim().length > 0 ||
                                    "Unit is required",
                            })}
                        />

                        {errors.unit && (
                            <ErrorMessage message={errors.unit.message} />
                        )}
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="purchasePrice">
                            Purchase Price{" "}
                            <span className="text-destructive">*</span>
                        </Label>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex w-[20%] items-center justify-center gap-1 rounded-l-md border-r bg-slate-800 text-xs text-slate-50">
                                <Wallet size={16} />
                                Rp
                            </div>

                            <Input
                                id="purchasePrice"
                                type="number"
                                min={0}
                                step={1}
                                placeholder="0"
                                disabled={isSubmitting}
                                className="pl-[22%]"
                                {...register("purchasePrice", {
                                    required: "Purchase price is required",
                                    valueAsNumber: true,
                                    min: {
                                        value: 0,
                                        message: "Purchase price cannot be negative",
                                    },
                                    validate: (value) =>
                                        Number.isInteger(value) ||
                                        "Purchase price must be an integer",
                                })}
                            />
                        </div>

                        {errors.purchasePrice && (
                            <ErrorMessage
                                message={errors.purchasePrice.message}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div className="space-y-2">
                            <Label htmlFor="categoryId">
                                Category{" "}
                                <span className="text-destructive">*</span>
                            </Label>

                            <Controller
                                name="categoryId"
                                control={control}
                                rules={{
                                    required: "Category is required",
                                    validate: (value) =>
                                        Number.isInteger(value) ||
                                        "Please select a category",
                                }}
                                render={({ field }) => (
                                    <Select
                                        value={
                                            field.value != null
                                                ? String(field.value)
                                                : ""
                                        }
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                        disabled={isSubmitting || isLoadingOptions}
                                    >
                                        <SelectTrigger id="categoryId" className="w-full">
                                            <SelectValue
                                                placeholder={
                                                    isLoadingOptions
                                                        ? "Loading categories..."
                                                        : "Select category"
                                                }
                                            />
                                        </SelectTrigger>

                                        <SelectContent className="w-full overflow-x-auto">
                                            <SelectGroup>
                                                <SelectLabel>Select Category</SelectLabel>
                                                {categoryActive.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={String(category.id)}
                                                    >
                                                        #{category.id} - {category.name}
                                                    </SelectItem>
                                                ))}
                                                <SelectSeparator />
                                                <SelectLabel>Total Active Categories: {categoryActive.length}</SelectLabel>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.categoryId && (
                                <ErrorMessage
                                    message={errors.categoryId.message}
                                />
                            )}
                        </div>




                        <div className="space-y-2">
                            <Label htmlFor="supplierId">
                                Supplier{" "}
                                <span className="text-destructive">*</span>
                            </Label>

                            <Controller
                                name="supplierId"
                                control={control}
                                rules={{
                                    required: "Supplier is required",
                                    validate: (value) =>
                                        Number.isInteger(value) ||
                                        "Please select a supplier",
                                }}
                                render={({ field }) => (
                                    <Select
                                        value={
                                            field.value != null
                                                ? String(field.value)
                                                : ""
                                        }
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                        disabled={isSubmitting || isLoadingOptions}
                                    >
                                        <SelectTrigger id="supplierId" className="w-full">
                                            <SelectValue
                                                placeholder={
                                                    isLoadingOptions
                                                        ? "Loading suppliers..."
                                                        : "Select supplier"
                                                }
                                            />
                                        </SelectTrigger>

                                        <SelectContent className="size-50 overflow-x-auto">
                                            <SelectGroup>
                                                <SelectLabel>Select Supplier</SelectLabel>
                                                {activeSupplier.map((supplier) => (
                                                    <SelectItem>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{supplier.name}</span>
                                                            <span className="text-xs text-muted-foreground">{supplier.email}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                                <SelectSeparator />
                                                <SelectLabel>Total Active Suppliers: {activeSupplier.length}</SelectLabel>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.supplierId && (
                                <ErrorMessage
                                    message={errors.supplierId.message}
                                />
                            )}
                        </div>

                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Opsional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter description..."
                            rows={4}
                            {...register("description")}
                        />
                    </div>



                    {mode === "edit" && items && (
                        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 rounded-md border p-3">
                            <div className="min-w-0 space-y-1">
                                <Label className="flex items-center gap-2 text-muted-foreground">
                                    <UserRound size={14} />
                                    Created By
                                </Label>

                                <p className="truncate text-sm font-medium">
                                    {items.createdBy?.name ?? "Unknown"}
                                </p>

                                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <CalendarClock size={12} />
                                    {items.createdAt ? date(items.createdAt) : ""}
                                </p>
                            </div>

                            <Separator orientation="vertical" className="h-full" />
                            <div className="min-w-0 space-y-1">
                                <Label className="flex items-center gap-2 text-muted-foreground">
                                    <UserRound size={14} />
                                    Updated By
                                </Label>

                                <p className="truncate text-sm font-medium">
                                    {items.updatedBy?.name ?? "Not updated yet"}
                                </p>

                                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <CalendarClock size={12} />
                                    {items.updatedAt ? date(items.updatedAt) : ""}
                                </p>
                            </div>
                        </div>
                    )}

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

                            disabled={isSubmitting || isLoadingOptions}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader className="size-4 animate-spin" />
                                    Savings...
                                </>
                            ) : mode === "create" ? (
                                <>
                                    <Plus className="size-4" />
                                    Create Item
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


