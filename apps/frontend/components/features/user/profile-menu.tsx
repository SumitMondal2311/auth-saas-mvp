"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLogout } from "@/hooks/use-logout";
import { globalStore } from "@/store/global.store";
import { userStore } from "@/store/user.store";
import { LogOut, PlusCircle, UserCircle } from "lucide-react";
import { ReactNode, useState } from "react";
import { UserAvatar } from "./user-avatar";

export const ProfileMenu = ({ children }: { children: ReactNode }) => {
    const { mutate } = useLogout();
    const { user } = userStore();
    const [open, setOpen] = useState(false);
    const { setOpenProfileModel } = globalStore();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="cursor-pointer">{children}</PopoverTrigger>
            <PopoverContent side="bottom" className="relative right-4 flex flex-col p-0">
                <div className="flex items-center gap-2 px-4 pb-2 pt-4">
                    <UserAvatar />
                    <span className="overflow-hidden text-ellipsis">
                        {user?.emailAddress.email}
                    </span>
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
