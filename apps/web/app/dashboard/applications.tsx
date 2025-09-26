"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/axios";
import { applicationStore } from "@/store/application.store";
import { Application } from "@/types/application";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Applications() {
    const { applications } = applicationStore();

    const api = async () =>
        await apiClient.get<{
            message: string;
            applications: Application[];
        }>("/api/application/get-all");

    const { isLoading, isFetching, isSuccess, data, isError, error } = useQuery<
        Awaited<ReturnType<typeof api>>
    >({
        queryKey: ["applications"],
        retry: false,
        queryFn: api,
    });

    useEffect(() => {
        if (isSuccess) {
            applicationStore.setState({ ...data.data });
        }
    }, [isSuccess, data]);

    if (isLoading || isFetching) {
        return Array.from(
            {
                length: 5,
            },
            (_, idx) => <Skeleton key={idx} className="h-60" />
        );
    }

    if (isError) {
        throw error;
    }

    return (
        <>
            {applications.map((app, idx) => (
                <div
                    key={idx}
                    className="hover:bg-accent flex h-60 cursor-pointer items-center justify-center rounded-md border transition-colors"
                >
                    {app.name}
                </div>
            ))}
        </>
    );
}
