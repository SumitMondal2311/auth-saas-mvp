import { meApi } from "@/lib/api";
import { userStore } from "@/store/user.store";
import { ApiErrorResponse } from "@/types/api-error-response";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useMe = () => {
    return useMutation<Awaited<ReturnType<typeof meApi>>, AxiosError<ApiErrorResponse>>({
        mutationFn: meApi,
        onSuccess: (response) => {
            const { user } = response.data;
            userStore.setState({ user });
        },
    });
};
