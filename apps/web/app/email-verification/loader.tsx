"use client";

import { apiClient } from "@/lib/axios";
import { ApiErrorResponse } from "@/types/api-error-response";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ReactNode } from "react";
import Loading from "../loading";

export default function Loader({ children }: { children: ReactNode }) {
    const api = async () => {
        return await apiClient.get<{
            email: string;
        }>("/api/auth/verify-email");
    };

    const { isPending, isFetching, isSuccess, error, data } = useQuery<
        Awaited<ReturnType<typeof api>>,
        AxiosError<ApiErrorResponse>
    >({
        queryKey: ["email-verification-flow-token"],
        retry: false,
        queryFn: api,
    });

    if (isPending || isFetching) {
        return <Loading />;
    }

    if (isSuccess) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="flex w-80 flex-col gap-8">
                    <div className="text-center">
                        <h1 className="font-mono text-2xl font-bold">Check your inbox</h1>
                        <p>Enter the verification code we just sent to {data.data.email}</p>
                    </div>
                    {children}
                </div>
            </div>
        );
    }

    throw error;
}
