import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userService } from "@/services/user.service";
import type { ErrorResponse } from "@/types/api";
import type { changePassword, changePasswordValues } from "@/types/user.types";
import { ErrorMessage } from "@/utils/error";
import axios from "axios";
import { Eye, EyeOff, Loader, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface ProfileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
};


export default function ProfileModal({
    open,
    onOpenChange,
    onSuccess
}: ProfileModalProps) {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false)
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<changePasswordValues>({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
        },
    });

    useEffect(() => {
        if (!open) return;

        reset({
            currentPassword: "",
            newPassword: ""
        });
    }, [open, reset]);


    const onSubmit = async (values: changePasswordValues) => {
        try {
            setSubmitting(true);

            const data: changePassword = {
                currentPassword: values.currentPassword.trim(),
                newPassword: values.newPassword.trim()
            };

            await userService.changePassword(data);
            onOpenChange(false);
            reset();
            onSuccess?.();
        } catch (error) {
            console.error("Failed to change password");
            if (axios.isAxiosError<ErrorResponse>(error)) {
                window.alert(
                    error.response?.data.message ?? error.message
                );
            } else if (error instanceof Error) {
                window.alert(error.message);
            } else {
                window.alert(
                    "Failed to change-password"
                );
            };
        } finally {
            setSubmitting(false);
        };
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Change Password
                    </DialogTitle>
                    <DialogDescription>
                        Change your password
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <div className="relative">
                            <Input
                                id="current-password"
                                type={showCurrentPassword ? "text" : "password"}
                                className="pr-10"
                                placeholder="Enter current password"
                                {...register("currentPassword", {
                                    required: "Current password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Current password must be at least 8 characters"
                                    }
                                })}
                            />

                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showCurrentPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                           {errors.currentPassword && (
                                <ErrorMessage
                                    message={errors.currentPassword?.message}
                                />
                            )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                            <Input
                                id="new-password"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                className="pr-10"
                                {...register("newPassword", {
                                    required: "New password is required",
                                    minLength: {
                                        value: 8,
                                        message: "New password must be at least 8 characters"
                                    }
                                })}
                            />

                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute text-slate-400 right-3 top-1/2 -translate-y-1/2"
                            >
                                {showNewPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <ErrorMessage message={errors.newPassword.message} />
                        )}
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
                            }>
                        
                        </DialogClose>
                          <Button
                                type="submit"
                                className="bg-slate-800 hover:bg-slate-900 transition-colors duration-300  focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 border border-slate-300/80"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Loader size={16} className="animate-spin" />
                                        Savings...
                                    </>
                                ) : (
                                    <>
                                        <LockKeyhole size={16} />
                                        Change Password
                                    </>
                                )}
                            </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

