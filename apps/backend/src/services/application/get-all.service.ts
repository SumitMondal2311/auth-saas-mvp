import { prisma } from "@repo/database";

export const getAllApplicationService = async (
    userId: string
): Promise<
    {
        name: string;
        id: string;
        updatedAt: Date;
    }[]
> => {
    const applications = await prisma.application.findMany({
        where: {
            userId,
        },
        select: {
            name: true,
            id: true,
            updatedAt: true,
        },
    });

    return applications;
};
