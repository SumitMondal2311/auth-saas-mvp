import { NextFunction, Request, Response } from "express";
import { IS_PRODUCTION } from "../../configs/constants.js";
import { env } from "../../configs/env.js";
import { emailPasswordSchema } from "../../configs/schemas.js";
import { loginService } from "../../services/auth/login.service.js";
import { APIError } from "../../utils/api-error.js";
import { handleAsync } from "../../utils/handle-async.js";
import { normalizedIP } from "../../utils/normalized-ip.js";

const loginControllerSync = async (req: Request, res: Response, next: NextFunction) => {
    const parsedSchema = emailPasswordSchema.safeParse(req.body);
    if (!parsedSchema.success) {
        return next(
            new APIError(400, {
                message: parsedSchema.error.issues[0].message,
            })
        );
    }

    const { email, password } = parsedSchema.data;
    const { refreshToken, accessToken } = await loginService({
        userAgent: req.headers["user-agent"],
        ipAddress: normalizedIP(req.ip || "unknown"),
        email,
        password,
    });

    res.status(200)
        .cookie("__auth-session", refreshToken, {
            secure: IS_PRODUCTION,
            httpOnly: true,
            sameSite: IS_PRODUCTION ? "none" : "lax",
            maxAge: env.REFRESH_TOKEN_EXPIRY * 1000,
        })
        .json({
            accessToken,
            message: "Logged in successfully",
        });
};

export const loginController = handleAsync(loginControllerSync);
