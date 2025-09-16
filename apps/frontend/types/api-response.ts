import { Application } from "./application";
import { ProfileInfo } from "./profile-info";

export type SignupApiResponse = {
    message: string;
    accessToken: string;
};

export type profileInfoApiResponse = {
    profileInfo: ProfileInfo;
    message: string;
};

export type VerifyEmailApiResponse = {
    GET: {
        email: string;
    };
    POST: {
        message: string;
        accessToken: string;
    };
};

export type RefreshApiResponse = {
    accessToken: string;
};

export type LoginApiResponse = {
    message: string;
    accessToken: string;
};

export type LogoutApiResponse = {
    message: string;
};

export type CreateApplicationApiResponse = {
    application: Application;
    message: string;
};

export type GetAllApplicationApiResponse = {
    applications: Application[];
};
