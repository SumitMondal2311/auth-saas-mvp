import { prisma } from "@repo/database";
import { randomUUID } from "crypto";
import { APIError } from "../../utils/api-error.js";

export const createApplicationService = async ({
    userId,
    name,
    usernameLogIn,
    phoneLogIn,
    githubLogIn,
}: {
    userId: string;
    name: string;
    usernameLogIn: boolean;
    phoneLogIn: boolean;
    githubLogIn: boolean;
}): Promise<{
    name: string;
    id: string;
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
            name,
            usernameLogIn,
            phoneLogIn,
            githubLogIn,
            secretKey: `sk_${randomUUID()}`,
            publishableKey: `pk_${randomUUID()}`,
            user: {
                connect: {
                    id: userId,
                },
            },
        },
        select: {
            name: true,
            id: true,
            updatedAt: true,
        },
    });

    return newApplication;
};
