import { AUTH_ROUTES } from "@/configs/frontend-routes";
import { authStore } from "@/store/auth.store";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { refreshApi } from "./api";

interface RetryableRequest extends AxiosRequestConfig {
    _retry?: boolean;
}

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_ORIGIN,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const { accessToken } = authStore.getState();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

let refreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });

    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequest;

        if (
            error.response?.status !== 401 ||
            originalRequest._retry ||
            AUTH_ROUTES.some((route) => originalRequest.url?.includes(route))
        ) {
            return Promise.reject(error);
        }

        if (refreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => {
                const { accessToken } = authStore.getState();
                const headers = originalRequest.headers;

                if (headers) {
                    headers.Authorization = `Bearer ${accessToken}`;
                }

                return apiClient(originalRequest);
            });
        }

        originalRequest._retry = true;
        refreshing = true;

        try {
            const { data } = await refreshApi();
            const { accessToken } = data;
            authStore.setState({ accessToken });
            processQueue(null, accessToken);
            const headers = originalRequest.headers;

            if (headers) {
                headers.Authorization = `Bearer ${accessToken}`;
            }

            return apiClient(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError as AxiosError);
            if (refreshError instanceof Error) {
                return Promise.reject(refreshError);
            }

            return Promise.reject(new Error(String(refreshError)));
        } finally {
            refreshing = false;
        }
    }
);
