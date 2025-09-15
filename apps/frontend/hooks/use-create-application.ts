"use client";

import { createApplicationApi } from "@/lib/api";
import { applicationStore } from "@/store/application.store";
import { ApiErrorResponse } from "@/types/api-error-response";
import { CreateApplicationApiRequestData } from "@/types/api-request-data";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateApplication = () => {
    const router = useRouter();
    return useMutation<
        Awaited<ReturnType<typeof createApplicationApi>>,
        AxiosError<ApiErrorResponse>,
        CreateApplicationApiRequestData
    >({
        mutationFn: createApplicationApi,
        onSuccess: (response) => {
            const { application, message } = response.data;
            toast.success(message || "Application created successfully");
            applicationStore.setState((state) => ({
                applications: [application, ...state.applications],
            }));
            router.push("/dashboard");
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Internal server error");
            } else {
                toast.error("Failed to create application");
            }
        },
    });
};
