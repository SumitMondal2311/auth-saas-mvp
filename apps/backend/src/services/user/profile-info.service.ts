import { AccountProvider, prisma } from "@repo/database";
import { APIError } from "../../utils/api-error.js";

export const profileInfoService = async (
    userId: string
): Promise<{
    emailAddresses: {
        isPrimary: boolean;
        value: string;
    }[];
    connectedAccounts: {
        providerUserId: string;
        provider: AccountProvider;
    }[];
    phoneNumbers: {
        isPrimary: boolean;
        value: string;
    }[];
}> => {
    const userRecord = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            identifiers: {
                select: {
                    type: true,
                    isPrimary: true,
                    value: true,
                },
            },
            accounts: {
                select: {
                    providerUserId: true,
                    provider: true,
                },
            },
        },
    });

    if (!userRecord) {
        throw new APIError(404, {
            message: "User not found",
        });
    }

    return {
        emailAddresses: userRecord.identifiers
            .filter((identifier) => identifier.type === "EMAIL")
            .map(({ type: _, ...rest }) => rest),
        connectedAccounts: userRecord.accounts.filter((account) => account.provider !== "LOCAL"),
        phoneNumbers: userRecord.identifiers
            .filter((identifier) => identifier.type === "PHONE")
            .map(({ type: _, ...rest }) => rest),
    };
};
