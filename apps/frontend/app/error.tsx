"use client";

import { ApiErrorResponse } from "@/types/api-error-response";
import { AxiosError } from "axios";

export default function ErrorPage({ error }: { error: AxiosError<ApiErrorResponse> }) {
    const data = error.response?.data;
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col gap-4">
                <span className="font-mono text-2xl">Oops, An error occurred!</span>
                <div className="flex justify-center gap-2 rounded-md bg-neutral-100 p-4 text-lg text-neutral-500">
                    {data?.statusCode || 500} - {data?.message || "Internal server error"}
                </div>
            </div>
        </div>
    );
}
