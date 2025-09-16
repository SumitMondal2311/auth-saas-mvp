import { NextFunction } from "express";
import { APIError } from "../utils/api-error.js";

export const validBodyMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.body || Object.keys(req.body).length <= 0) {
        return next(
            new APIError(400, {
                message: "required object body, received null",
            })
        );
    }

    next();
};
