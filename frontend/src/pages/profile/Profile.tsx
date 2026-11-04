import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { userService } from "@/services/user.service";
import type { UserData } from "@/types/user.types";
import { date } from "@/utils/date";
import { CheckCircle, LockKeyhole, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import ProfileModal from "./ProfileEditModalDialog";
import Spinner from "@/components/common/Spinner";

export default function ProfilePage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);

    const handleEdit = () => {
        setDialogOpen(true);
    };

    const fetchUser = async () => {
        try {
            setLoading(true);

            const response = await userService.getMe();
            setUser(response.data);
        } catch (error) {
            console.error("Failed to get profile", error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 300);
        };
    };

    useEffect(() => {
        fetchUser();
    }, []);


    return (
        <div className="space-y-6">
            <div className="flex  items-start md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                        Profile Setting
                    </h2>
                    <p className="text-sm text-slate-500">
                        Update your account.
                    </p>
                </div>
                <button
                    type="button"
                    className="inline-flex items-center  gap-2 rounded-lg border border-slate-300/50 bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-slate-600/15 transition-all duration-100 hover:shadow-xl focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    onClick={handleEdit}
                >
                    <LockKeyhole size={14} />
                    Change Password
                </button>
            </div>

            {loading ? (
                <Spinner text="Loading data..." />
            ) : (
                <div className="bg-white p-6 space-y-4 border border-slate-200 rounded-xl shadow-sm">
                    <div>
                        <h3 className="text-sm text-slate-800 font-bold tracking-wider">
                            Your profile info
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            View and manage your personal information and account details.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <div className="shrink-0">
                            <Avatar className="size-22">
                                <AvatarImage
                                    src="https://github.com/evilrabbit.png"
                                    alt={user?.email}
                                    className="rounded-lg"
                                />
                                <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() ?? "US"}</AvatarFallback>
                                <AvatarBadge className={user?.isActive ? "bg-emerald-600" : "bg-slate-600"} />
                            </Avatar>
                        </div>

                        <div className="grid flex-1 grid-cols-2 gap-x-12 gap-y-5 min-w-0">
                            <div>
                                <p className="text-xs text-slate-500">Full Name</p>
                                <p className="text-sm font-semibold text-slate-800">
                                    {user?.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">Email</p>
                                <p className="text-sm font-semibold text-slate-800">
                                    {user?.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">Role</p>
                                <p className="text-sm font-semibold text-slate-800">
                                    {user?.role}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">Status</p>
                                <p className="text-sm font-semibold text-slate-800">
                                    <Badge
                                        variant="outline"
                                        className={user?.isActive
                                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                            : "border border-red-200 bg-red-50 text-red-700"
                                        }
                                    >
                                        {user?.isActive ? (
                                            <>
                                                <CheckCircle />
                                                Active
                                            </>
                                        ) : (
                                            <>
                                                <XCircle />
                                                Nonactive
                                            </>
                                        )}
                                    </Badge>
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">createdAt</p>
                                <p className="text-sm text-slate-800 font-semibold">
                                    {user?.createdAt ? date(user.createdAt) : ""}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">updatedAt</p>
                                <p className="text-sm text-slate-800 font-semibold">
                                    {user?.updatedAt ? date(user.updatedAt) : ""}
                                </p>
                            </div>
                        </div>
                    </div>


                </div>
            )}

            <ProfileModal
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSuccess={async () => {
                    await fetchUser();
                }}
            />
        </div>
    );
};