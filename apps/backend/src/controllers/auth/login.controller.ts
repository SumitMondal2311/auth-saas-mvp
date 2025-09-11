import { NextFunction, Request, Response } from "express";
import { IS_PRODUCTION } from "../../configs/constants.js";
import { env } from "../../configs/env.js";
import { authSchema } from "../../configs/schemas.js";
import { signAccessToken } from "../../lib/jwt.js";
import { loginService } from "../../services/auth/login.service.js";
import { addDurationToNow } from "../../utils/add-duration-to-now.js";
import { APIError } from "../../utils/api-error.js";
import { handleAsync } from "../../utils/handle-async.js";
import { normalizedIP } from "../../utils/normalized-ip.js";

const loginControllerSync = async (req: Request, res: Response, next: NextFunction) => {
    const parsedSchema = authSchema.safeParse(req.body);
    if (!parsedSchema.success) {
        return next(
            new APIError(400, {
                message: parsedSchema.error.issues[0].message,
            })
        );
    }

    const { email, password } = parsedSchema.data;
    const { refreshToken, userId, isPrimaryEmail, sessionId } = await loginService({
        userAgent: req.headers["user-agent"],
        ipAddress: normalizedIP(req.ip || "unknown"),
        email,
        password,
    });

    res.status(200)
        .cookie("__HOST-auth-session", refreshToken, {
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
                    emailAddress: {
                        isPrimary: isPrimaryEmail,
                        email,
                    },
                },
                addDurationToNow(env.ACCESS_TOKEN_EXPIRY * 1000)
            ),
            message: "Logged in successfully",
        });
};

export const loginController = handleAsync(loginControllerSync);
