import Spinner from "@/components/common/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { userService } from "@/services/user.service";
import type { ErrorResponse } from "@/types/api";
import type { UserData } from "@/types/user.types";
import { date } from "@/utils/date";
import { ErrorMessage } from "@/utils/error";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface UserDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userById: number | null;
};

export default function UserDetailsDialog({
    open,
    onOpenChange,
    userById
}: UserDetailsDialogProps) {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open || userById === null) return;

        const fetchUser = async () => {
            try {
                setIsLoading(true);
                setError(null);
                setUser(null);

                const response = await userService.getUserById(userById);
                setUser(response.data);
            } catch (error) {
                const message = axios.isAxiosError<ErrorResponse>(error)
                    ? error.response?.data.message ||
                    "Failed to fetch user."
                    : "An unexpected error occured."

                setError(message);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 300);
            };
        };

        fetchUser();
    }, [open, userById]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        User details
                    </DialogTitle>
                    <DialogDescription>
                        View user information.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-8">
                        <Spinner text="Loading user details..." />
                    </div>
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : user ? (
                    <div className="space-y-5 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs to-slate-500">
                                    User ID
                                </p>
                                <p className="text-lg font-semibold">
                                    #{user.id}
                                </p>
                            </div>
                            <Badge
                                variant="outline"
                                className={user.isActive
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-red-200 bg-red-50 text-red-700"
                                }
                            >
                                {user.isActive ? (
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
                                <p className="text-sm to-slate-500">
                                    Role
                                </p>
                                <p className="font-medium">
                                    {user.role ? (
                                        user.role === "ADMIN"
                                            ? "Administrator"
                                            : "Staff"
                                    ) : "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">
                                    Email
                                </p>
                                <p className="font-medium">
                                    {user.email || "-"}
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
                                    {user.createdAt ? date(user.createdAt) : "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">
                                    Updated At
                                </p>
                                <p className="text-sm font-medium">
                                    {user.updatedAt ? date(user.updatedAt) : "-"}
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


