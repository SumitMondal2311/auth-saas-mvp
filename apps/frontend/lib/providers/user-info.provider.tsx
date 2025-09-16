"use client";

import { AUTH_ROUTES } from "@/configs/frontend-routes";
import { useMe } from "@/hooks/use-profile-info";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

export function UserInfoProvider({ children }: { children: ReactNode }) {
    const { mutate } = useMe();
    const pathname = usePathname();

    useEffect(() => {
        if (!AUTH_ROUTES.some((route) => pathname.includes(route))) {
            mutate(undefined);
        }
    }, [mutate, pathname]);

    return children;
}
