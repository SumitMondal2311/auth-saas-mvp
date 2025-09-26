import { NextFunction, Request, Response } from "express";
import { IS_PRODUCTION } from "../../../configs/constants.js";
import { env } from "../../../configs/env.js";
import { APIError } from "../../../utils/api-error.js";
import { refreshService } from "../services/refresh.service.js";

export const refreshController = async (req: Request, res: Response, _next: NextFunction) => {
    const refreshToken = req.cookies["__refresh"] as string;
    if (!refreshToken) {
        throw new APIError(401, {
            message: "Missing refresh token",
        });
    }

    res.clearCookie("__access");
    const tokens = await refreshService(refreshToken);
    if (!tokens) {
        res.clearCookie("__refresh");
        throw new APIError(401, {
            message: "Session expired. Please log in again",
        });
    }

    const { newRefreshToken, newAccessToken } = tokens;

    res.status(200)
        .cookie("__refresh", newRefreshToken, {
            secure: IS_PRODUCTION,
            httpOnly: true,
            sameSite: IS_PRODUCTION ? "none" : "lax",
            maxAge: env.REFRESH_TOKEN_EXPIRY * 1000,
        })
        .cookie("__access", newAccessToken, {
            secure: IS_PRODUCTION,
            httpOnly: false,
            sameSite: IS_PRODUCTION ? "none" : "lax",
            maxAge: env.ACCESS_TOKEN_EXPIRY * 1000,
        })
        .json({ success: true });
};
