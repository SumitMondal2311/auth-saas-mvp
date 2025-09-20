import { NextFunction, Request, Response } from "express";
import { profileInfoService } from "../../services/user/profile-info.service.js";
import { APIError } from "../../utils/api-error.js";

export const profileInfoController = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.activeSessionInfo;
    if (!data) {
        return next(
            new APIError(401, {
                message: "Unauthorized",
            })
        );
    }

    const { userId } = data;
    const profileInfo = await profileInfoService(userId);

    res.status(200).json({
        profileInfo,
    });
};
