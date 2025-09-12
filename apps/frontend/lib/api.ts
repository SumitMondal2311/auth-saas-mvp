import {
    LoginApiResponse,
    LogoutApiResponse,
    MeApiResponse,
    RefreshApiResponse,
    SignupApiResponse,
    VerifyEmailApiResponse,
} from "@/types/api-response";
import { apiClient } from "./axios";

export const signupApi = async (data: { email: string; password: string }) => {
    return apiClient.post<SignupApiResponse>("/auth/signup", data);
};

export const meApi = async () => {
    return apiClient.get<MeApiResponse>("/user/me");
};

export const verifyEmailApi = {
    GET: async () => {
        return apiClient.get<VerifyEmailApiResponse["GET"]>(`/auth/verify-email`);
    },
    POST: async (data: { code: string }) => {
        return apiClient.post<VerifyEmailApiResponse["POST"]>(`/auth/verify-email`, data);
    },
};

export const refreshApi = async () => {
    return apiClient.post<RefreshApiResponse>("/auth/refresh");
};

export const loginApi = async (data: { email: string; password: string }) => {
    return apiClient.post<LoginApiResponse>("/auth/login", data);
};

export const logoutApi = async () => {
    return apiClient.post<LogoutApiResponse>("/auth/logout");
};
