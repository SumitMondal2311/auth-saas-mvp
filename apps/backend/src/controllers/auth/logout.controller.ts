import { NextFunction, Request, Response } from "express";
import { logoutService } from "../../services/auth/logout.service.js";
import { APIError } from "../../utils/api-error.js";
import { handleAsync } from "../../utils/handle-async.js";
import { normalizedIP } from "../../utils/normalized-ip.js";

const logoutControllerSync = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies["__auth-session"] as string;
    if (!refreshToken) {
        return next(
            new APIError(400, {
                message: "Missing refresh token",
            })
        );
    }

    const data = req.activeSession;
    if (!data) {
        return next(
            new APIError(401, {
                message: "Unauthorized",
            })
        );
    }

    const { id, userId } = data;

    await logoutService({
        ipAddress: normalizedIP(req.ip || "unknown"),
        userAgent: req.headers["user-agent"],
        refreshToken,
        userId,
        sessionId: id,
    });

    res.status(200).clearCookie("__auth-session").json({ message: "Logged out successfully" });
};

export const logoutController = handleAsync(logoutControllerSync);
