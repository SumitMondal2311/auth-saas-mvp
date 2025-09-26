import { NextFunction, Response } from "express";
import { redis } from "../../../lib/redis.js";
import { APIError } from "../../../utils/api-error.js";
import { SignupClient, VerificationMiddlewareRequest } from "../types/signup.type.js";

export const verificationMiddleware = async (
    req: VerificationMiddlewareRequest,
    _res: Response,
    next: NextFunction
) => {
    const clientId = req.cookies["__client"] as string;
    if (!clientId) {
        throw new APIError(422, {
            message: "Missing client ID",
        });
    }

    const payload = await redis.get(`__client:${clientId}`);
    if (!payload) {
        throw new APIError(422, {
            message: "Invalid client ID",
        });
    }

    req.client = JSON.parse(payload) as SignupClient;
    next();
};
