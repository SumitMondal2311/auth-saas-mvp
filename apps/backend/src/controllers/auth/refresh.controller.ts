import { NextFunction, Request, Response } from "express";
import { IS_PRODUCTION } from "../../configs/constants.js";
import { env } from "../../configs/env.js";
import { signAccessToken } from "../../lib/jwt.js";
import { refreshService } from "../../services/auth/refresh.service.js";
import { addDurationToNow } from "../../utils/add-duration-to-now.js";
import { APIError } from "../../utils/api-error.js";
import { handleAsync } from "../../utils/handle-async.js";

const refreshControllerSync = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies["__HOST-auth-session"] as string;
    if (!refreshToken) {
        return next(
            new APIError(401, {
                message: "Missing refresh token",
            })
        );
    }

    const { newRefreshToken, userId, emailAddress, sessionId } = await refreshService(refreshToken);

    res.clearCookie("__HOST-auth-session");
    res.status(200)
        .cookie("__HOST-auth-session", newRefreshToken, {
            secure: IS_PRODUCTION,
            httpOnly: true,
            maxAge: env.REFRESH_TOKEN_EXPIRY * 1000,
            sameSite: "strict",
        })
        .json({
            accessToken: await signAccessToken(
                {
                    sid: sessionId,
                    sub: userId,
                    emailAddress,
                },
                addDurationToNow(env.ACCESS_TOKEN_EXPIRY * 1000)
            ),
        });
};

export const refreshController = handleAsync(refreshControllerSync);
