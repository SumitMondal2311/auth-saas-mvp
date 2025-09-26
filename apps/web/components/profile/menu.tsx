"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserProfileImage } from "@/components/user-profile-image";
import { apiClient } from "@/lib/axios";
import { authStore } from "@/store/auth.store";
import { globalStore } from "@/store/global.store";
import { userStore } from "@/store/user.store";
import { ApiErrorResponse } from "@/types/api-error-response";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { LogOut, PlusCircle, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { toast } from "sonner";

const api = () => {
    return apiClient.post<{
        message: string;
    }>("/api/auth/logout");
};

export const ProfileMenu = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const { primaryEmail } = userStore();
    const [open, setOpen] = useState(false);
    const { setOpenProfileModel } = globalStore();

    const { mutate } = useMutation<Awaited<ReturnType<typeof api>>, AxiosError<ApiErrorResponse>>({
        mutationFn: api,
        onSuccess: (response) => {
            const { message } = response.data;
            toast.success(message || "Logged out successfully");
            authStore.setState({ accessToken: null });
            router.push("/login");
        },
        onError: (error) => {
            if (error.response) {
                toast.error(error.response?.data?.message);
            } else {
                throw error;
            }
        },
    });

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="cursor-pointer">{children}</PopoverTrigger>
            <PopoverContent side="bottom" className="relative right-4 flex flex-col p-0">
                <div className="flex items-center gap-2 px-4 pb-2 pt-4">
                    <UserProfileImage />
                    <span className="overflow-hidden text-ellipsis">{primaryEmail}</span>
                </div>
                <div className="divide-y">
                    <div className="flex justify-between px-4 pb-4 pt-2">
                        {[
                            {
                                onClick: () => {
                                    setOpenProfileModel(true);
                                    setOpen(false);
                                },
                                Icon: UserCircle,
                                label: "Manage account",
                            },
                            {
                                onClick: () => mutate(undefined),
                                Icon: LogOut,
                                label: "Log out",
                            },
                        ].map((btn, idx) => (
                            <Button
                                variant="outline"
                                key={idx}
                                onClick={btn.onClick}
                                className="cursor-pointer"
                            >
                                <btn.Icon />
                                {btn.label}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="ghost"
                        className="h-12 w-full cursor-pointer rounded-none rounded-b-md"
                    >
                        <PlusCircle />
                        Add account
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};
