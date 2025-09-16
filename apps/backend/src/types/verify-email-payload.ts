export type VerifyEmailPayload = {
    email: string;
    code: string;
    hashedPassword: string;
};
