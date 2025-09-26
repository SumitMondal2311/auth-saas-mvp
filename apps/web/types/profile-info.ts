export type ProfileInfo = {
    emailAddresses: {
        value: string;
        isPrimary: boolean;
    }[];
    connectedAccounts: {
        provider: "GOOGLE" | "GITHUB";
        providerUserId: string;
    }[];
    phoneNumbers: {
        value: string;
        isPrimary: boolean;
    }[];
};
