import { prisma } from "@repo/database";
import { APIError } from "../../../utils/api-error.js";

export const getService = async (
    appId: string
): Promise<{
    name: string;
    updatedAt: Date;
}> => {
    const applicationRecord = await prisma.application.findUnique({
        where: {
            id: appId,
        },
        select: {
            updatedAt: true,
            name: true,
        },
    });

    if (!applicationRecord) {
        throw new APIError(404, {
            message: "App does not exist",
        });
    }

    return applicationRecord;
};
