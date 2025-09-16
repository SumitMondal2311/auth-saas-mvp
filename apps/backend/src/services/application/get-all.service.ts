import { prisma } from "@repo/database";

export const getAllApplicationService = async (
    userId: string
): Promise<
    {
        name: string;
        updatedAt: Date;
    }[]
> => {
    const applications = await prisma.application.findMany({
        where: {
            userId,
        },
        select: {
            updatedAt: true,
            name: true,
        },
    });

    return applications;
};
