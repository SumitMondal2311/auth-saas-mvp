import { profileInfoApi } from "@/lib/api";
import { userStore } from "@/store/user.store";
import { ApiErrorResponse } from "@/types/api-error-response";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useMe = () => {
    return useMutation<Awaited<ReturnType<typeof profileInfoApi>>, AxiosError<ApiErrorResponse>>({
        mutationFn: profileInfoApi,
        onSuccess: (response) => {
            const { profileInfo } = response.data;
            userStore.setState({ profileInfo });
            userStore.setState({
                primaryPhone: profileInfo.phoneNumbers.find((phone) => phone.isPrimary === true)
                    ?.value,
            });
            userStore.setState({
                primaryEmail: profileInfo.emailAddresses.find((email) => email.isPrimary === true)
                    ?.value,
            });
        },
    });
};
