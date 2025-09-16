export type VerifyEmailApiRequestData = {
    code: string;
};

export type AuthApiRequestData = {
    email: string;
    password: string;
};

export type CreateApplicationApiRequestData = {
    name: string;
    usernameLogIn?: boolean;
    phoneLogIn?: boolean;
    githubLogIn?: boolean;
};
