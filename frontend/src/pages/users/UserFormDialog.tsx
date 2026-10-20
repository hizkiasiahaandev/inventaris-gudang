import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userService } from "@/services/user.service";
import type { ErrorResponse } from "@/types/api";
import type { Mode } from "@/types/mode.type";
import type { UserFormValues, registerData, updateUser, UserData } from "@/types/user.types";
import axios from "axios";
import { Info, Loader, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface UserFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: Mode;
    user?: UserData | null;
    onSuccess: () => void
}

export default function UserFormDialog({
    open,
    onOpenChange,
    mode,
    user,
    onSuccess
}: UserFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserFormValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        if (!open) return;

        if (mode === "edit" && user) {
            reset({
                name: user.name,
                email: user.email,
            });
        } else {
            reset({
                name: "",
                email: "",
                password: "",
            });
        };
    }, [open, mode, user, reset]);

    const onSubmit = async (values: UserFormValues) => {
        try {
            setIsSubmitting(true);

            if (mode === "create") {
                const data: registerData = {
                    name: values.name.trim(),
                    email: values.email.trim(),
                    password: values.password.trim(),
                };

                await userService.register(data);
            } else {
                if (!user) return;

                const data: updateUser = {
                    name: values.name.trim(),
                    email: values.email.trim()
                };

                await userService.updateUser(user.id, data);
            }

            onOpenChange(false);
            reset();
            onSuccess()
        } catch (error) {
            console.error("Failed to save user", error);
            if (axios.isAxiosError<ErrorResponse>(error)) {
               window.alert(
                error.response?.data.message ?? error.message
               );
            } else  if (error instanceof Error) {
                window.alert(error.message);
            } else {
                window.alert(
                    mode === "create"
                    ? "Failed to create user."
                    : "Failed to update user."
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
                            ? "Create user"
                            : "Update user"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Create a new staff account."
                            : "Update the user's account information."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter full name"
                            {...register("name", {
                                required: "Name is required",
                                validate: (value) =>
                                    value.trim().length > 0 ||
                                    "Name is required",
                            })}
                        />
                        {errors.name && (
                            <p role="alert" className="flex text-xs items-center gap-1  text-destructive">
                                <Info size={13} />
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter email address"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address",
                                }
                            })}
                        />
                        {errors.email && (
                            <p className="flex text-xs items-center gap-1  text-destructive">
                                <Info size={13} />
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {mode === "create" && (
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password  must be at least 8 characters",
                                    }
                                })}

                            />
                            {errors.password && (
                                <p role="alert" className="flex text-xs items-center gap-1  text-destructive">
                                    <Info size={13} />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    )}

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
                            className="bg-slate-800 hover:bg-slate-900 transition-colors duration-300  focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 border border-slate-300/80"
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
                                    Create User
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