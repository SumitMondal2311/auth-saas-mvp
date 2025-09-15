"use client";

import { signupApi } from "@/lib/api";
import { authStore } from "@/store/auth.store";
import { ApiErrorResponse } from "@/types/api-error-response";
import { AuthApiRequestData } from "@/types/api-request-data";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignup = () => {
    const router = useRouter();

    return useMutation<
        Awaited<ReturnType<typeof signupApi>>,
        AxiosError<ApiErrorResponse>,
        AuthApiRequestData
    >({
        mutationFn: signupApi,
        onSuccess: (response) => {
            const { accessToken, message } = response.data;
            toast.success(message || "Signed up successfully");
            authStore.setState({ accessToken });
            router.push("/email-verification");
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Internal server error");
            } else {
                toast.error("Failed to sign up");
            }
        },
    });
};
