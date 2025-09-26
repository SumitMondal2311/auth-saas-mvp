import { NextFunction, Response } from "express";
import { z } from "zod";
import { IS_PRODUCTION } from "../../../configs/constants.js";
import { env } from "../../../configs/env.js";
import { verificationCodeSchema } from "../../../configs/schemas.js";
import { APIError } from "../../../utils/api-error.js";
import { maskedEmail } from "../../../utils/masked-email.js";
import { normalizedIP } from "../../../utils/normalized-ip.js";
import { attemptVerificationService } from "../services/verification.service.js";
import { VerificationMiddlewareRequest } from "../types/signup.type.js";

// -- -- -- Prepare Verification Controller -- -- -- //

export const prepareVerificationController = (
    req: VerificationMiddlewareRequest,
    res: Response,
    _next: NextFunction
) => {
    if (!req.client) {
        throw new APIError(422, {
            message: "Verification has expired",
        });
    }

    const { emailAddress } = req.client;

    res.status(200).json({
        emailAddress: maskedEmail(emailAddress),
    });
};

// -- -- -- Attempt Verification Controller -- -- -- //

interface AttemptVerificationRequest extends VerificationMiddlewareRequest {
    body: z.infer<typeof verificationCodeSchema>;
}

export const attemptVerificationController = async (
    req: AttemptVerificationRequest,
    res: Response,
    _next: NextFunction
) => {
    const { success, error, data } = verificationCodeSchema.safeParse(req.body);
    if (!success) {
        throw new APIError(400, {
            message: error.issues[0].message,
        });
    }

    const { code } = data;

    if (!req.applicationInfo) {
        throw new APIError(403, {
            message: "No access credential found",
        });
    }

    if (!req.client) {
        throw new APIError(400, {
            message: "Verification has expired",
        });
    }

    const { refreshToken, accessToken } = await attemptVerificationService({
        appId: req.applicationInfo.id,
        ipAddress: normalizedIP(req.ip ?? "unknown"),
        userAgent: req.headers["user-agent"],
        code,
        client: req.client,
    });

    res.status(200)
        .clearCookie("__client")
        .cookie("__refresh", refreshToken, {
            secure: IS_PRODUCTION,
            httpOnly: true,
            sameSite: IS_PRODUCTION ? "none" : "lax",
            maxAge: env.REFRESH_TOKEN_EXPIRY * 1000,
        })
        .cookie("__access", accessToken, {
            secure: IS_PRODUCTION,
            httpOnly: false,
            sameSite: IS_PRODUCTION ? "none" : "lax",
            maxAge: env.ACCESS_TOKEN_EXPIRY * 1000,
        })
        .json({ success: true });
};
