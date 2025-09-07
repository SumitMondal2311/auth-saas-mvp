import { NextFunction, Request, Response } from "express";
import { IS_PRODUCTION } from "../../configs/constants.js";
import { env } from "../../configs/env.js";
import { authSchema } from "../../configs/schemas.js";
import { signupService } from "../../services/auth/signup.service.js";
import { APIError } from "../../utils/api-error.js";
import { handleAsync } from "../../utils/handle-async.js";
import { normalizedIP } from "../../utils/normalized-ip.js";

const signupControllerSync = async (req: Request, res: Response, next: NextFunction) => {
    const parsedSchema = authSchema.safeParse(req.body);
    if (!parsedSchema.success) {
        return next(
            new APIError(400, {
                message: parsedSchema.error.issues[0].message,
            })
        );
    }

    const { email, password } = parsedSchema.data;
    const token = await signupService({
        userAgent: req.headers["user-agent"],
        ipAddress: normalizedIP(req.ip || "unknown"),
        email,
        password,
    });

    res.status(201)
        .cookie("__HOST-email_verification", token, {
            secure: IS_PRODUCTION,
            httpOnly: true,
            maxAge: env.EMAIL_VERIFICATION_TOKEN_EXPIRY * 1000,
            sameSite: "strict",
        })
        .json({
            success: "true",
            message: "Signed up successfully. A verification code has been sent to your email.",
        });
};

export const signupController = handleAsync(signupControllerSync);
