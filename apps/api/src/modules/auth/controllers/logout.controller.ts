import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../../../lib/jwt.js";
import { APIError } from "../../../utils/api-error.js";
import { normalizedIP } from "../../../utils/normalized-ip.js";
import { logoutService } from "../services/logout.service.js";

export const logoutController = async (req: Request, res: Response, _next: NextFunction) => {
    const refreshToken = req.cookies["__refresh"] as string;
    if (!refreshToken) {
        throw new APIError(400, {
            message: "Missing refresh token",
        });
    }

    const { payload } = await verifyToken(refreshToken);
    const { aud, sid, jti } = payload;
    if (!aud || !sid || !jti) {
        throw new APIError(401, {
            message: "Invalid refresh token",
        });
    }

    await logoutService({
        ipAddress: normalizedIP(req.ip ?? "unknown"),
        userAgent: req.headers["user-agent"],
        refreshPayload: payload,
    });

    res.status(200).clearCookie("__refresh").clearCookie("__access").json({
        success: true,
    });
};
