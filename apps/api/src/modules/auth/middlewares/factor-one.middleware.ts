import { NextFunction, Response } from "express";
import { redis } from "../../../lib/redis.js";
import { APIError } from "../../../utils/api-error.js";
import { FactorOneClient, FactorOneMiddlewareRequest } from "../types/factor-one.type.js";

export const factorOneMiddleware = async (
    req: FactorOneMiddlewareRequest,
    _res: Response,
    next: NextFunction
) => {
    const clientId = req.cookies["__client"] as string;
    if (!clientId) {
        throw new APIError(422, {
            message: "Missing client ID",
        });
    }

    const client = await redis.get(`__client:${clientId}`);
    if (!client) {
        throw new APIError(422, {
            message: "Invalid client ID",
        });
    }

    req.client = JSON.parse(client) as FactorOneClient;

    next();
};
