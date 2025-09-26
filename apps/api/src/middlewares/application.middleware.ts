import { prisma } from "@repo/database";
import { NextFunction, Request, Response } from "express";
import { publishableKeySchema } from "../configs/schemas.js";
import { APIError } from "../utils/api-error.js";

export const applicationMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
    const { success, error, data } = publishableKeySchema.safeParse({
        publishableKey: req.headers["x-publishable-key"],
    });

    if (!success) {
        throw new APIError(400, {
            message: error.issues[0].message,
        });
    }

    const applicationRecord = await prisma.application.findUnique({
        where: {
            publishableKey: data.publishableKey,
        },
        select: {
            username: true,
            id: true,
            google: true,
            github: true,
            publishableKey: true,
        },
    });

    if (!applicationRecord) {
        throw new APIError(400, {
            message: "Invalid publishable key",
        });
    }

    req.applicationInfo = applicationRecord;

    next();
};
