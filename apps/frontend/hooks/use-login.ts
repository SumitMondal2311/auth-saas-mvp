"use client";

import { loginApi } from "@/lib/api";
import { authStore } from "@/store/auth.store";
import { ApiErrorResponse } from "@/types/api-error-response";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogin = () => {
    const router = useRouter();

    return useMutation<
        Awaited<ReturnType<typeof loginApi>>,
        AxiosError<ApiErrorResponse>,
        { email: string; password: string }
    >({
        mutationFn: loginApi,
        onSuccess: (response) => {
            const { accessToken, message } = response.data;
            toast.success(message || "Logged in successfully");
            authStore.setState({ accessToken });
            router.push("/dashboard");
        },
        onError: (error) => {
            console.log(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Internal server error");
            } else {
                toast.error("Failed to log in");
            }
        },
    });
};
