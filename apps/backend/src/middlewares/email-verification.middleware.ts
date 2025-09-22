import { NextFunction, Request, Response } from "express";
import { APIError } from "../utils/api-error";

declare module "express" {
    interface Request {
        emailVerificationFlowToken?: string;
    }
}

export const emailVerificationMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies["__email-verification-flow-token"] as string;
    if (!token) {
        return next(
            new APIError(400, {
                message: "Missing token",
            })
        );
    }

    req.emailVerificationFlowToken = token;

    next();
};
