import { AuthApiRequestData, CreateApplicationApiRequestData } from "@/types/api-request-data";
import {
    CreateApplicationApiResponse,
    GetAllApplicationApiResponse,
    LoginApiResponse,
    LogoutApiResponse,
    profileInfoApiResponse,
    RefreshApiResponse,
    SignupApiResponse,
    VerifyEmailApiResponse,
} from "@/types/api-response";
import { apiClient } from "./axios";

export const signupApi = async (data: AuthApiRequestData) => {
    return apiClient.post<SignupApiResponse>("/auth/signup", data);
};

export const profileInfoApi = async () => {
    return apiClient.get<profileInfoApiResponse>("/user/me");
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

export const loginApi = async (data: AuthApiRequestData) => {
    return apiClient.post<LoginApiResponse>("/auth/login", data);
};

export const logoutApi = async () => {
    return apiClient.post<LogoutApiResponse>("/auth/logout");
};

export const getAllApplicationApi = async () => {
    return apiClient.get<GetAllApplicationApiResponse>("/application/get-all");
};

export const createApplicationApi = async (data: CreateApplicationApiRequestData) => {
    return apiClient.post<CreateApplicationApiResponse>("/application/create", data);
};
