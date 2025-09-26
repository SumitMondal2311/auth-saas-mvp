import { prisma } from "@repo/database";

export const getAllService = async (
    accountId: string
): Promise<
    {
        name: string;
        updatedAt: Date;
    }[]
> => {
    const applicationRecords = await prisma.application.findMany({
        where: {
            accountId,
        },
        select: {
            updatedAt: true,
            name: true,
        },
    });

    return applicationRecords;
};
