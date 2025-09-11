import { NextFunction, Request, Response } from "express";
import { APIError } from "../../utils/api-error.js";

export const meController = (req: Request, res: Response, next: NextFunction) => {
    const data = req.protectedData;
    if (!data) {
        return next(
            new APIError(401, {
                message: "Unauthorized",
            })
        );
    }

    const { userId, emailAddress } = data;

    res.status(200).json({
        user: {
            id: userId,
            emailAddress,
        },
    });
};
