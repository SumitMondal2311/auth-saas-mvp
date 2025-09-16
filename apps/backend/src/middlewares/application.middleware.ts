import { prisma } from "@repo/database";
import { NextFunction, Request, Response } from "express";
import "http";
import { applicationMiddlewareSchema } from "../configs/schemas.js";
import { APIError } from "../utils/api-error.js";
import { handleAsync } from "../utils/handle-async.js";

declare module "express" {
    interface Request {
        application?: {
            id: string;
            options: {
                usernameLogIn: boolean;
                phoneLogIn: boolean;
                githubLogIn: boolean;
            };
        };
    }
}

declare module "http" {
    interface IncomingHttpHeaders {
        "x-publishable-key": string;
    }
}

const applicationMiddlewareSync = async (req: Request, _res: Response, next: NextFunction) => {
    const parsedSchema = applicationMiddlewareSchema.safeParse({
        publishableKey: req.headers["x-publishable-key"],
    });
    if (!parsedSchema.success) {
        return next(
            new APIError(400, {
                message: parsedSchema.error.issues[0].message,
            })
        );
    }

    const { publishableKey } = parsedSchema.data;

    const applicationRecord = await prisma.application.findUnique({
        where: {
            publishableKey,
        },
        select: {
            id: true,
            usernameLogIn: true,
            phoneLogIn: true,
            githubLogIn: true,
        },
    });

    if (!applicationRecord) {
        return next(
            new APIError(401, {
                message: "Unauthorized",
            })
        );
    }

    const { id, usernameLogIn, phoneLogIn, githubLogIn } = applicationRecord;

    req.application = {
        id,
        options: {
            usernameLogIn,
            phoneLogIn,
            githubLogIn,
        },
    };

    next();
};

export const applicationMiddleware = handleAsync(applicationMiddlewareSync);
