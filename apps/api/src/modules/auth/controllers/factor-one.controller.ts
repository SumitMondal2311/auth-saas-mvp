import { NextFunction, Response } from "express";
import { IS_PRODUCTION } from "../../../configs/constants.js";
import { env } from "../../../configs/env.js";
import { APIError } from "../../../utils/api-error.js";
import { maskedEmail } from "../../../utils/masked-email.js";
import { normalizedIP } from "../../../utils/normalized-ip.js";
import { attemptFactorOneService } from "../services/factor-one.service.js";
import { AttemptFactorOneInput, FactorOneMiddlewareRequest } from "../types/factor-one.type.js";

// -- -- -- Prepare Factor-One Controller -- -- -- //

export const prepareFactorOneController = (
    req: FactorOneMiddlewareRequest,
    res: Response,
    _next: NextFunction
) => {
    if (!req.client) {
        throw new APIError(422, {
            message: "Verification has expired",
        });
    }

    const { strategy, emailAddress } = req.client;

    res.status(200).json({
        strategy,
        emailAddress: maskedEmail(emailAddress),
    });
};

// -- -- -- Attempt Factor-One Controller -- -- -- //

interface AttemptFactorOneRequest extends FactorOneMiddlewareRequest {
    body: AttemptFactorOneInput;
}

export const attemptFactorOneController = async (
    req: AttemptFactorOneRequest,
    res: Response,
    _next: NextFunction
) => {
    if (!req.client) {
        throw new APIError(422, {
            message: "Verification has expired",
        });
    }

    const { refreshToken, accessToken } = await attemptFactorOneService({
        userAgent: req.headers["user-agent"],
        ipAddress: normalizedIP(req.ip ?? "unknown"),
        input: req.body,
        client: req.client,
    });

    res.status(200)
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
