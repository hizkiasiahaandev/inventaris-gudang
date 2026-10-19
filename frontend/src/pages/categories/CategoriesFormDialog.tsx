import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categoryService } from "@/services/category.service";
import type { ErrorResponse } from "@/types/api";
import type { CategoryFormValues, CategoryData, createCategory, updateCategory } from "@/types/category.types";
import type { Mode } from "@/types/mode.type";
import axios from "axios";
import { Info, Loader, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";


interface CategoriesFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: Mode;
    categories?: CategoryData | null;
    onSuccess: () => void;
}

export default function CategoriesFormDialog({
    open,
    onOpenChange,
    mode,
    categories,
    onSuccess
}: CategoriesFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CategoryFormValues>({
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (!open) return;

        if (mode === "edit" && categories) {
            reset({
                name: categories.name,
                description: categories.description,
            });
        } else {
            reset({
                name: "",
                description: "",
            });
        };
    }, [open, mode, categories, reset]);

    const onSubmit = async (values: CategoryFormValues) => {
        try {
            setIsSubmitting(true);

            if (mode === "create") {
                const data: createCategory = {
                    name: values.name.trim(),
                    description: values.description.trim(),
                };

                await categoryService.createCategory(data);
            } else {
                if (!categories) return;

                const data: updateCategory = {
                    name: values.name.trim(),
                    description: values.description.trim(),
                };

                await categoryService.updateCategory(categories.id, data);
            }

            onOpenChange(false);
            reset();
            onSuccess();
        } catch (error) {
            console.error("Failed to save categories", error);
            if (axios.isAxiosError<ErrorResponse>(error)) {
                window.alert(
                    error.response?.data.message ?? error.message
                );
            } else if (error instanceof Error) {
                window.alert(error.message);
            } else {
                window.alert(
                    mode === "create"
                        ? "Failed to create categories."
                        : "Failed to update categories."
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
                            ? "Create categories"
                            : "Update categories"
                        }
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Create a new categories"
                            : "Update the categories information."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            placeholder="Enter name"
                            {...register("name", {
                                required: "Name is required",
                                validate: (value) =>
                                    value.trim().length > 0 ||
                                    "Name is required"
                            })}
                        />
                        {errors.name && (
                            <p role="alert" className="flex items-center text-xs gap-1 text-red-500">
                                <Info size={13} />
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Input
                            id="description"
                            placeholder="Enter a description"
                            { ...register("description")}
                        />
                        {errors.description && (
                            <p role="alert" className="flex items-center gap-1 text-red-500 text-xs">
                                <Info size={13} />
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isSubmitting}
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>

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
                                    Create Category
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
    )
}