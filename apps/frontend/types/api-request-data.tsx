export type VerifyEmailApiRequestData = {
    code: string;
};

export type AuthApiRequestData = {
    email: string;
    password: string;
};

export type CreateApplicationApiRequestData = {
    name: string;
    username?: boolean;
    phone?: boolean;
    github?: boolean;
};
