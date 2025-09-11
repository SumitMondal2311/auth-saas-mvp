export type ProtectedData = {
    userId: string;
    emailAddress: {
        isPrimary: boolean;
        email: string;
    };
    sessionId: string;
};
