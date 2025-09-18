import { NextFunction, Request, Response } from "express";
import parsePhoneNumberFromString, { CountryCode } from "libphonenumber-js";
import { IS_PRODUCTION } from "../../configs/constants.js";
import { env } from "../../configs/env.js";
import { emailPasswordSchema, usernamePasswordSchema } from "../../configs/schemas.js";
import { emailLoginService } from "../../services/application-auth/email-login.service.js";
import { phoneLoginService } from "../../services/application-auth/phone-login.service.js";
import { usernameLoginService } from "../../services/application-auth/username-login.service.js";
import { APIError } from "../../utils/api-error.js";
import { handleAsync } from "../../utils/handle-async.js";
import { normalizedIP } from "../../utils/normalized-ip.js";

const loginControllerSync = async (req: Request, res: Response, next: NextFunction) => {
    const { applicationInfo } = req;
    if (!applicationInfo) {
        return next(
            new APIError(401, {
                message: "Unauthorized",
            })
        );
    }

    const { id, loginOptions } = applicationInfo;

    const ipAddress = normalizedIP(req.ip || "unknown");
    const userAgent = req.headers["user-agent"];

    const { strategy, countryCode, phoneNumber, emailOrUsername } = req.body as {
        countryCode: CountryCode;
        phoneNumber: string;
        strategy: "phone" | "email_or_username";
        emailOrUsername: string;
    };

    if (strategy === "phone" && loginOptions.phone) {
        const parsed = parsePhoneNumberFromString(phoneNumber, countryCode);
        if (parsed) {
            if (parsed.isValid()) {
                const token = await phoneLoginService({
                    phone: parsed.number,
                    applicationId: id,
                });
                return res
                    .status(200)
                    .cookie("__phone-login-flow-token", token, {
                        secure: IS_PRODUCTION,
                        httpOnly: true,
                        sameSite: IS_PRODUCTION ? "none" : "lax",
                        maxAge: env.REFRESH_TOKEN_EXPIRY * 1000,
                    })
                    .json({
                        message: "A verification code has been sent to your phone",
                    });
            } else {
                return next(
                    new APIError(400, {
                        message: "Invalid phone number",
                    })
                );
            }
        } else {
            return next(
                new APIError(400, {
                    message: "Failed to parse phone number",
                })
            );
        }
    }

    if (strategy === "email_or_username" && loginOptions.username) {
        const parsedSchema = usernamePasswordSchema.safeParse({
            ...req.body,
            username: emailOrUsername,
        });

        if (parsedSchema.success) {
            const { username, password } = parsedSchema.data;
            const { accessToken, refreshToken } = await usernameLoginService({
                ipAddress,
                username,
                userAgent,
                password,
                applicationId: id,
            });
            return res
                .status(200)
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
        } else {
            const parsedSchema = emailPasswordSchema.safeParse({
                ...req.body,
                email: emailOrUsername,
            });

            if (parsedSchema.success) {
                const { email, password } = parsedSchema.data;
                const { accessToken, refreshToken } = await emailLoginService({
                    ipAddress,
                    userAgent,
                    email,
                    password,
                    applicationId: id,
                });
                return res
                    .status(200)
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
            } else {
                return next(
                    new APIError(400, {
                        message: parsedSchema.error.issues.map((issue) => issue.message).join(", "),
                    })
                );
            }
        }
    }

    const parsedSchema = emailPasswordSchema.safeParse(req.body);
    if (!parsedSchema.success) {
        return next(
            new APIError(400, {
                message: parsedSchema.error.issues.map((issue) => issue.message).join(", "),
            })
        );
    }

    const { email, password } = parsedSchema.data;
    const { accessToken, refreshToken } = await emailLoginService({
        ipAddress,
        userAgent,
        email,
        password,
        applicationId: id,
    });

    return res
        .status(200)
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
