import { NextFunction, Request, Response } from "express";
import { APIError } from "../utils/api-error.js";

export const prepareInputMiddleware = (
    req: Request<any, any, Record<string, unknown>>,
    _res: Response,
    next: NextFunction
): void => {
    if (typeof req.body !== "object" || Object.keys(req.body).length <= 0) {
        throw new APIError(400, {
            message: "Required object, received null",
        });
    }

    next();
};
