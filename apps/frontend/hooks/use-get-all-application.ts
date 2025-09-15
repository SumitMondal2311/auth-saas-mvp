"use client";

import { getAllApplicationApi } from "@/lib/api";
import { applicationStore } from "@/store/application.store";
import { ApiErrorResponse } from "@/types/api-error-response";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useGetAllApplication = () => {
    return useMutation<
        Awaited<ReturnType<typeof getAllApplicationApi>>,
        AxiosError<ApiErrorResponse>
    >({
        mutationFn: getAllApplicationApi,
        onSuccess: (response) => {
            const { applications } = response.data;
            applicationStore.setState({ applications });
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Internal server error");
            } else {
                toast.error("Failed to fetch applications");
            }
        },
    });
};
