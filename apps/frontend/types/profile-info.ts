export type ProfileInfo = {
    emailAddresses: {
        value: string;
        isPrimary: boolean;
    }[];
    accounts: {
        provider: "GOOGLE" | "LOCAL" | "GITHUB";
        providerUserId: string;
    }[];
    phoneNumbers: {
        value: string;
        isPrimary: boolean;
    }[];
};
