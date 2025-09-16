import { NextFunction, Request, Response } from "express";
import { getAllApplicationService } from "../../services/application/get-all.service.js";
import { APIError } from "../../utils/api-error.js";
import { handleAsync } from "../../utils/handle-async.js";

const getAllApplicationControllerSync = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.activeSession;
    if (!data) {
        return next(
            new APIError(401, {
                message: "Unauthorized",
            })
        );
    }

    const applications = await getAllApplicationService(data.userId);

    res.status(200).json({
        applications,
    });
};

export const getAllApplicationController = handleAsync(getAllApplicationControllerSync);
