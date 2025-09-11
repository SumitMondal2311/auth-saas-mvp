import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/jwt.js";
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

    const { payload } = await verifyAccessToken(accessToken);
    const { sub, emailAddress, sid } = payload;
    if (!sub || !emailAddress || !sid) {
        return next(
            new APIError(401, {
                message: "Invalid access token",
            })
        );
    }

    req.protectedData = {
        sessionId: sid,
        userId: sub,
        emailAddress,
    };

    next();
};

export const authMiddleware = handleAsync(authMiddlewareSync);
