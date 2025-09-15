"use client";

import { verifyEmailApi } from "@/lib/api";
import { authStore } from "@/store/auth.store";
import { ApiErrorResponse } from "@/types/api-error-response";
import { VerifyEmailApiRequestData } from "@/types/api-request-data";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useVerifyEmail = {
    GET: () => {
        return useMutation<
            Awaited<ReturnType<typeof verifyEmailApi.GET>>,
            AxiosError<ApiErrorResponse>
        >({
            mutationFn: verifyEmailApi.GET,
        });
    },
    POST: () => {
        const router = useRouter();

        return useMutation<
            Awaited<ReturnType<typeof verifyEmailApi.POST>>,
            AxiosError<ApiErrorResponse>,
            VerifyEmailApiRequestData
        >({
            mutationFn: verifyEmailApi.POST,
            onSuccess: (response) => {
                const { accessToken, message } = response.data;
                toast.success(message || "Email verified successfully");
                authStore.setState({ accessToken });
                router.push("/dashboard");
            },
            onError: (error) => {
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data?.message || "Internal server error");
                } else {
                    toast.error("Failed to verify email");
                }
            },
        });
    },
};
