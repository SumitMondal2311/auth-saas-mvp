"use client";

import Loading from "@/app/loading";
import { PROTECTED_ROUTES } from "@/configs/frontend-routes";
import { apiClient } from "@/lib/axios";
import { userStore } from "@/store/user.store";
import { ApiErrorResponse } from "@/types/api-error-response";
import { ProfileInfo } from "@/types/profile-info";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

const api = async () =>
    apiClient.get<{
        profileInfo: ProfileInfo;
    }>("/api/user/me");

export const ProfileInfoProvider = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();

    const { isLoading, isFetching, isError, error, isSuccess, data } = useQuery<
        Awaited<ReturnType<typeof api>>,
        AxiosError<ApiErrorResponse>
    >({
        queryKey: ["profile-info"],
        retry: false,
        queryFn: api,
        enabled: PROTECTED_ROUTES.some((route) => route.includes(pathname)),
    });

    useEffect(() => {
        if (isSuccess) {
            const { emailAddresses, phoneNumbers } = data.data.profileInfo;
            userStore.setState({
                primaryEmail: emailAddresses.find((email) => email.isPrimary)?.value,
                primaryPhone: phoneNumbers.find((phone) => phone.isPrimary)?.value,
            });
        }
    }, [isSuccess, data]);

    if (isLoading || isFetching) {
        return <Loading />;
    }

    if (isError) {
        if (!error.response) throw error;
    }

    return children;
};
