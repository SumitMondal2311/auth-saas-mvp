import { prisma } from "@repo/database";
import { randomUUID } from "crypto";
import { APIError } from "../../../utils/api-error.js";

export const createService = async ({
    username,
    google,
    github,
    name,
    accountId,
}: {
    username: boolean;
    google: boolean;
    github: boolean;
    name: string;
    accountId: string;
}): Promise<{
    name: string;
    updatedAt: Date;
}> => {
    const applicationRecord = await prisma.application.findFirst({
        where: {
            accountId,
            name,
        },
        select: {
            id: true,
        },
    });

    if (applicationRecord) {
        throw new APIError(403, {
            message: `${name} is already exists in your account`,
        });
    }

    const newApplication = await prisma.application.create({
        data: {
            secretKey: `sk_${randomUUID()}`,
            google,
            github,
            name,
            username,
            publishableKey: `pk_${randomUUID()}`,
            account: {
                connect: {
                    id: accountId,
                },
            },
        },
        select: {
            updatedAt: true,
            name: true,
        },
    });

    return newApplication;
};
