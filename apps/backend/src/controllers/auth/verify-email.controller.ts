import { NextFunction, Request, Response } from "express";
import { IS_PRODUCTION } from "../../configs/constants.js";
import { env } from "../../configs/env.js";
import { verificationCodeSchema } from "../../configs/schemas.js";
import { signToken } from "../../lib/jwt.js";
import { verifyEmailService } from "../../services/auth/verify-email.service.js";
import { addDurationToNow } from "../../utils/add-duration-to-now.js";
import { APIError } from "../../utils/api-error.js";
import { handleAsync } from "../../utils/handle-async.js";
import { normalizedIP } from "../../utils/normalized-ip.js";

export const verifyEmailController = {
    GET: handleAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies["__HOST-email_verification"] as string;
        if (!token) {
            return next(
                new APIError(400, {
                    message: "Missing token",
                })
            );
        }

        const email = await verifyEmailService.GET(token);

        res.status(202).json({
            email,
        });
    }),
    POST: handleAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies["__HOST-email_verification"] as string;
        if (!token) {
            return next(
                new APIError(400, {
                    message: "Invalid or missing token",
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

        const { refreshToken, userId, sessionId } = await verifyEmailService.POST({
            userAgent: req.headers["user-agent"],
            code,
            ipAddress: normalizedIP(req.ip || "unknown"),
            token,
        });

        res.status(200)
            .cookie("__HOST-auth-session", refreshToken, {
                secure: IS_PRODUCTION,
                httpOnly: true,
                maxAge: env.REFRESH_TOKEN_EXPIRY * 1000,
                sameSite: "strict",
            })
            .clearCookie("__HOST-email_verification")
            .json({
                accessToken: await signToken(
                    {
                        typ: "access",
                        sub: userId,
                        sid: sessionId,
                    },
                    addDurationToNow(env.ACCESS_TOKEN_EXPIRY * 1000)
                ),
                message: "Email verification successful",
            });
    }),
};
