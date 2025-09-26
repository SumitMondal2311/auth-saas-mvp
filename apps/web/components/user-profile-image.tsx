"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userStore } from "@/store/user.store";
import React from "react";

export const UserProfileImage = ({ ...props }: React.ComponentPropsWithoutRef<typeof Avatar>) => {
    const { primaryEmail } = userStore();

    return (
        <Avatar {...props}>
            <AvatarImage src="/profile-img.png" />
            <AvatarFallback>{primaryEmail.split("")[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
    );
};
