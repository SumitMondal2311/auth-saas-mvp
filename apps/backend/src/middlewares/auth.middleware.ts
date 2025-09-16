import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt.js";
import { APIError } from "../utils/api-error.js";
import { handleAsync } from "../utils/handle-async.js";

declare module "express" {
    interface Request {
        activeSession?: {
            id: string;
            userId: string;
        };
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
                message: "Invalid token",
            })
        );
    }

    req.activeSession = {
        id: sid,
        userId: sub,
    };

    next();
};

export const authMiddleware = handleAsync(authMiddlewareSync);
