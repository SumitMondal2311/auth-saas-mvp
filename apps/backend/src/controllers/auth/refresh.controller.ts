import { NextFunction, Request, Response } from "express";
import { IS_PRODUCTION } from "../../configs/constants.js";
import { env } from "../../configs/env.js";
import { refreshService } from "../../services/auth/refresh.service.js";
import { APIError } from "../../utils/api-error.js";
import { handleAsync } from "../../utils/handle-async.js";

const refreshControllerSync = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies["__auth-session"] as string;
    if (!refreshToken) {
        return next(
            new APIError(401, {
                message: "Missing refresh token",
            })
        );
    }

    const { newRefreshToken, newAccessToken } = await refreshService(refreshToken);

    res.clearCookie("__auth-session");
    res.status(200)
        .cookie("__auth-session", newRefreshToken, {
            secure: IS_PRODUCTION,
            httpOnly: true,
            sameSite: IS_PRODUCTION ? "none" : "lax",
            maxAge: env.REFRESH_TOKEN_EXPIRY * 1000,
        })
        .json({
            accessToken: newAccessToken,
        });
};

export const refreshController = handleAsync(refreshControllerSync);
