"use client";

import { CustomError } from "@/components/custom-error";
import { ApiErrorResponse } from "@/types/api-error-response";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

export default function Error({ error }: { error: AxiosError<ApiErrorResponse> }) {
    const [errorResponse, setErrorResponse] = useState<ApiErrorResponse>({
        message: "Internal server error",
        statusCode: 500,
    });

    useEffect(() => {
        if (error.response) {
            setErrorResponse(error.response.data);
        } else {
            setErrorResponse({
                message: "Server Unreachable",
                statusCode: 503,
            });
        }
    }, [error]);

    return <CustomError {...errorResponse} />;
}
