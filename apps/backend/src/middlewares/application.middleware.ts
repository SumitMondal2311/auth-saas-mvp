import { prisma } from "@repo/database";
import { NextFunction, Request, Response } from "express";
import { applicationMiddlewareSchema } from "../configs/schemas.js";
import { APIError } from "../utils/api-error.js";
import { handleAsync } from "../utils/handle-async.js";

declare module "express" {
    interface Request {
        applicationInfo?: {
            id: string;
            loginOptions: {
                username: boolean;
                phone: boolean;
                github: boolean;
            };
        };
    }
}

declare module "http" {
    interface IncomingHttpHeaders {
        "x-public-key": string;
    }
}

const applicationMiddlewareSync = async (req: Request, _res: Response, next: NextFunction) => {
    const parsedSchema = applicationMiddlewareSchema.safeParse({
        publicKey: req.headers["x-public-key"],
    });

    if (!parsedSchema.success) {
        return next(
            new APIError(400, {
                message: parsedSchema.error.issues[0].message,
            })
        );
    }

    const { publicKey } = parsedSchema.data;

    const applicationRecord = await prisma.application.findUnique({
        where: {
            publicKey,
        },
        select: {
            username: true,
            id: true,
            mobile: true,
            github: true,
        },
    });

    if (!applicationRecord) {
        return next(
            new APIError(401, {
                message: "Unauthorized",
            })
        );
    }

    const { id, username, mobile, github } = applicationRecord;

    req.applicationInfo = {
        id,
        loginOptions: {
            username,
            phone: mobile,
            github,
        },
    };

    next();
};

export const applicationMiddleware = handleAsync(applicationMiddlewareSync);
