import { NextFunction, Request, Response } from "express";
import { APIError } from "../utils/api-error.js";

export const validBodyMiddleware = (
    req: Request<any, any, Record<string, unknown>>,
    _res: Response,
    next: NextFunction
): void => {
    if (typeof req.body !== "object" || Object.keys(req.body).length <= 0) {
        return next(
            new APIError(400, {
                message: "required object body, received null",
            })
        );
    }

    next();
};
