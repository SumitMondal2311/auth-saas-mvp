import { NextFunction, Request, Response } from "express";
import { IS_PRODUCTION } from "../../configs/constants.js";
import { env } from "../../configs/env.js";
import { verificationCodeSchema } from "../../configs/schemas.js";
import { verifyEmailService } from "../../services/auth/verify-email.service.js";
import { APIError } from "../../utils/api-error.js";
import { handleAsync } from "../../utils/handle-async.js";
import { normalizedIP } from "../../utils/normalized-ip.js";

const verifyEmailControllerSync = async (req: Request, res: Response, next: NextFunction) => {
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
        code,
        ipAddress: normalizedIP(req.ip || "unknown"),
        token: req.emailVerificationFlowToken || "invalid-token",
    });

    res.status(200)
        .cookie("__auth-session", refreshToken, {
            secure: IS_PRODUCTION,
            httpOnly: true,
            sameSite: IS_PRODUCTION ? "none" : "lax",
            maxAge: env.REFRESH_TOKEN_EXPIRY * 1000,
        })
        .clearCookie("__email-verification")
        .json({
            accessToken,
            message: "Email verified successfully",
        });
};

export const verifyEmailController = handleAsync(verifyEmailControllerSync);
