import { prisma } from "@repo/database";
import { randomUUID } from "crypto";
import { APIError } from "../../utils/api-error.js";

export const createApplicationService = async ({
    userId,
    name,
    username,
    phone,
    github,
}: {
    userId: string;
    name: string;
    username: boolean;
    phone: boolean;
    github: boolean;
}): Promise<{
    name: string;
    updatedAt: Date;
}> => {
    const applicationRecord = await prisma.application.findFirst({
        where: {
            userId,
            name,
        },
        select: {
            id: true,
        },
    });

    if (applicationRecord) {
        throw new APIError(403, {
            message: `${name} is alreay exists in your account`,
        });
    }

    const newApplication = await prisma.application.create({
        data: {
            mobile: phone,
            username,
            github,
            name,
            secretKey: `sk_${randomUUID()}`,
            publicKey: `pk_${randomUUID()}`,
            user: {
                connect: {
                    id: userId,
                },
            },
        },
        select: {
            name: true,
            updatedAt: true,
        },
    });

    return newApplication;
};
