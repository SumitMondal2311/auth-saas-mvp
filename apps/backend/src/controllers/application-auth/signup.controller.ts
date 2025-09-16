import { NextFunction, Request, Response } from "express";
import { IS_PRODUCTION } from "../../configs/constants.js";
import { env } from "../../configs/env.js";
import { authSchema } from "../../configs/schemas.js";
import { signupService } from "../../services/application-auth/signup.service.js";
import { APIError } from "../../utils/api-error.js";
import { handleAsync } from "../../utils/handle-async.js";

const signupControllerSync = async (req: Request, res: Response, next: NextFunction) => {
    const { application } = req;
    if (!application) {
        return next(
            new APIError(401, {
                message: "Unauthorized",
            })
        );
    }

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
        applicationId: application.id,
        email,
        password,
    });

    res.status(201)
        .cookie("__email-verification", token, {
            secure: IS_PRODUCTION,
            path: "/",
            httpOnly: true,
            maxAge: env.EMAIL_VERIFICATION_CODE_EXPIRY * 1000,
            sameSite: IS_PRODUCTION ? "none" : "lax",
        })
        .json({
            success: "true",
            message: "Signed up successfully. A verification code has been sent to your email.",
        });
};

export const signupController = handleAsync(signupControllerSync);
