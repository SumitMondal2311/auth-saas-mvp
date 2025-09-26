import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt.js";
import { APIError } from "../utils/api-error.js";

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        throw new APIError(401, {
            message: "Missing authorization header",
        });
    }

    const [schema, accessToken] = authHeader.split(" ");
    if (schema !== "Bearer" || !accessToken) {
        throw new APIError(401, {
            message: "Invalid authorization header",
        });
    }

    const { payload } = await verifyToken(accessToken);
    const { aud, sub, sid } = payload;
    if (!aud || !sub || !sid) {
        throw new APIError(401, {
            message: "Invalid token",
        });
    }

    req.currSessionInfo = {
        userId: sub,
        id: sid,
        accountId: aud as string,
    };

    next();
};
