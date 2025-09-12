export type SignupApiResponse = {
    message: string;
    accessToken: string;
};

export type MeApiResponse = {
    user: {
        emailAddress: {
            isPrimary: boolean;
            email: string;
        };
        id: string;
    };
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
