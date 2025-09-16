"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";
import { userStore } from "@/store/user.store";
import React from "react";

export const UserAvatar = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<typeof Avatar>) => {
    const { primaryEmail } = userStore();

    return (
        <Avatar className={cn(className)} {...props}>
            <AvatarImage src="/profile-img.png" />
            <AvatarFallback>{primaryEmail.split("")[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
    );
};
