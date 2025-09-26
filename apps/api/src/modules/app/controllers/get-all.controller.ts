import { NextFunction, Request, Response } from "express";
import { APIError } from "../../../utils/api-error.js";
import { getAllService } from "../services/get-all.service.js";

export const getAllController = async (req: Request, res: Response, _next: NextFunction) => {
    const session = req.currSessionInfo;
    if (!session) {
        throw new APIError(401, {
            message: "Unauthorized",
        });
    }

    res.status(200).json({ applications: await getAllService(session.accountId) });
};
