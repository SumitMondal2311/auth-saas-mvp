import { NextFunction, Request, Response } from "express";
import { IS_PRODUCTION } from "../../configs/constants.js";
import { env } from "../../configs/env.js";
import { verificationCodeSchema } from "../../configs/schemas.js";
import { verifyEmailService } from "../../services/application-auth/verify-email.service.js";
import { APIError } from "../../utils/api-error.js";
import { normalizedIP } from "../../utils/normalized-ip.js";

export const verifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
    const { applicationInfo } = req;
    if (!applicationInfo) {
        return next(
            new APIError(401, {
                message: "Unauthorized",
            })
        );
    }

    const token = req.cookies["__email-verification-flow-token"] as string;
    if (!token) {
        return next(
            new APIError(400, {
                message: "Missing token",
            })
        );
    }

    const parsedSchema = verificationCodeSchema.safeParse(req.body);
    if (!parsedSchema.success) {
        return next(
            new APIError(400, {
                message: parsedSchema.error.issues[0].message,
            })
        );
    }

    const { code } = parsedSchema.data;

    const { refreshToken, accessToken } = await verifyEmailService({
        userAgent: req.headers["user-agent"],
        ipAddress: normalizedIP(req.ip || "unknown"),
        code,
        applicationId: applicationInfo.id,
        token,
    });

    res.status(200)
        .cookie("__auth-session", refreshToken, {
            secure: IS_PRODUCTION,
            httpOnly: true,
            sameSite: IS_PRODUCTION ? "none" : "lax",
            maxAge: env.REFRESH_TOKEN_EXPIRY * 1000,
        })
        .clearCookie("__email-verification-flow-token")
        .json({
            accessToken,
            message: "Email verified successfully",
        });
};
