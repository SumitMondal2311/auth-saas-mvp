import { NextFunction, Request, Response } from "express";
import { IS_PRODUCTION } from "../../configs/constants.js";
import { env } from "../../configs/env.js";
import { applicationAuthSchema } from "../../configs/schemas.js";
import { loginService } from "../../services/application-auth/login.service.js";
import { APIError } from "../../utils/api-error.js";
import { handleAsync } from "../../utils/handle-async.js";
import { normalizedIP } from "../../utils/normalized-ip.js";

const loginControllerSync = async (req: Request, res: Response, next: NextFunction) => {
    const { application } = req;
    if (!application) {
        return next(
            new APIError(401, {
                message: "Unauthorized",
            })
        );
    }

    const { id, loginOptions } = application;

    const parsedSchema = applicationAuthSchema.safeParse(req.body);
    if (!parsedSchema.success) {
        return next(
            new APIError(400, {
                message: parsedSchema.error.errors.map((error) => error.message).join(", "),
            })
        );
    }

    const { identifier, password } = parsedSchema.data;
    const serviceResult = await loginService({
        ipAddress: normalizedIP(req.ip || "unknown"),
        userAgent: req.headers["user-agent"],
        identifier,
        loginOptions,
        password,
        applicationId: id,
    });

    if (serviceResult.status === "opt_sent") {
        const { token } = serviceResult;
        return res
            .status(200)
            .cookie("__phone-login", token, {
                secure: IS_PRODUCTION,
                path: "/",
                httpOnly: true,
                maxAge: env.PHONE_LOGIN_CODE_EXPIRY * 1000,
                sameSite: IS_PRODUCTION ? "none" : "lax",
            })
            .json({
                message: "An OTP has been sent to your number",
            });
    }

    const { refreshToken, accessToken } = serviceResult;
    res.status(200)
        .cookie("__auth-session", refreshToken, {
            secure: IS_PRODUCTION,
            path: "/",
            httpOnly: true,
            maxAge: env.REFRESH_TOKEN_EXPIRY * 1000,
            sameSite: IS_PRODUCTION ? "none" : "lax",
        })
        .json({
            accessToken,
            message: "Logged in successfully",
        });
};

export const loginController = handleAsync(loginControllerSync);
