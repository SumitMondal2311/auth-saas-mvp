import { prisma } from "@repo/database";
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt.js";
import { ProtectedData } from "../types/protected-data.js";
import { APIError } from "../utils/api-error.js";
import { handleAsync } from "../utils/handle-async.js";

declare module "express" {
    interface Request {
        protectedData?: ProtectedData;
    }
}

const authMiddlewareSync = async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return next(
            new APIError(401, {
                message: "Missing authorization header",
            })
        );
    }

    const [schema, accessToken] = authHeader.split(" ");
    if (schema !== "Bearer" || !accessToken) {
        return next(
            new APIError(401, {
                message: "Invalid authorization header",
            })
        );
    }

    const { payload } = await verifyToken(accessToken);
    const { sub, sid } = payload;
    if (!sub || !sid) {
        return next(
            new APIError(401, {
                message: "Invalid access token claims",
            })
        );
    }

    const sessionRecord = await prisma.session.findUnique({
        where: {
            userId: sub,
            id: sid,
        },
        select: {
            id: true,
            emailAddress: {
                select: {
                    email: true,
                },
            },
        },
    });

    if (!sessionRecord) {
        throw new APIError(401, {
            message: "Session not found",
        });
    }

    const {
        emailAddress: { email },
    } = sessionRecord;

    req.protectedData = {
        userId: sub,
        email,
        sessionId: sid,
    };

    next();
};

export const authMiddleware = handleAsync(authMiddlewareSync);
