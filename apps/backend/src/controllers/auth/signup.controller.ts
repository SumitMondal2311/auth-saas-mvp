import { NextFunction, Request, Response } from "express";
import { IS_PRODUCTION } from "../../configs/constants.js";
import { env } from "../../configs/env.js";
import { authSchema } from "../../configs/schemas.js";
import { signupService } from "../../services/auth/signup.service.js";
import { APIError } from "../../utils/api-error.js";
import { handleAsync } from "../../utils/handle-async.js";

const signupControllerSync = async (req: Request, res: Response, next: NextFunction) => {
    const parsedSchema = authSchema.safeParse(req.body);
    if (!parsedSchema.success) {
        return next(
            new APIError(400, {
                message: parsedSchema.error.issues[0].message,
            })
        );
    }

    const { password, email } = parsedSchema.data;
    const token = await signupService(email, password);

    res.status(201)
        .cookie("__HOST-email_verification", token, {
            secure: IS_PRODUCTION,
            httpOnly: true,
            maxAge: env.EMAIL_VERIFICATION_CODE_EXPIRY * 1000,
            sameSite: "strict",
        })
        .json({
            success: "true",
            message: "Signed up successfully. A verification code has been sent to your email.",
        });
};

export const signupController = handleAsync(signupControllerSync);
