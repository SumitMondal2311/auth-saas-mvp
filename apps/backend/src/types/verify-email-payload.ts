export type VerifyEmailPayload = {
    hashedPassword: string;
    email: string;
    verificationCode: string;
};
