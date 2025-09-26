import { NextFunction, Request, Response } from "express";
import { applicationSchema } from "../../../configs/schemas.js";
import { APIError } from "../../../utils/api-error.js";
import { createService } from "../services/create.service.js";

export const createController = async (req: Request, res: Response, _next: NextFunction) => {
    const session = req.currSessionInfo;
    if (!session) {
        throw new APIError(401, {
            message: "Unauthorized",
        });
    }

    const { accountId } = session;

    const { success, error, data } = applicationSchema.safeParse(req.body);
    if (!success) {
        throw new APIError(400, {
            message: error.issues[0].message,
        });
    }

    res.status(201).json({ application: await createService({ accountId, ...data }) });
};
