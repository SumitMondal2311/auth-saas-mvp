import { NextFunction, Request, Response } from "express";
import { APIError } from "../../../utils/api-error.js";
import { validateUUID } from "../../../utils/validate-uuid.js";
import { getService } from "../services/get.service.js";

interface GetAppRequest extends Request {
    body: {
        appId: string;
    };
}

export const getController = async (req: GetAppRequest, res: Response, _next: NextFunction) => {
    const { appId } = req.body;
    if (!appId || !validateUUID(appId)) {
        throw new APIError(401, {
            message: "Invalid or missing app ID",
        });
    }

    const session = req.currSessionInfo;
    if (!session) {
        throw new APIError(401, {
            message: "Unauthorized",
        });
    }

    res.status(200).json({ application: await getService(appId) });
};
