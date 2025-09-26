import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { IS_PRODUCTION } from "../../../configs/constants.js";
import { env } from "../../../configs/env.js";
import { emailSchema, passwordSchema } from "../../../configs/schemas.js";
import { APIError } from "../../../utils/api-error.js";
import { signupService } from "../services/signup.service.js";

const emailPasswordSchema = emailSchema.merge(passwordSchema);

interface SignupRequest extends Request {
    body: z.infer<typeof emailPasswordSchema>;
}

export const signupController = async (req: SignupRequest, res: Response, _next: NextFunction) => {
    const { success, error, data } = emailPasswordSchema.safeParse(req.body);
    if (!success) {
        throw new APIError(400, {
            message: error.issues[0].message,
        });
    }

    const { password, email } = data;

    res.status(201)
        .cookie("__client", await signupService(email, password), {
            secure: IS_PRODUCTION,
            httpOnly: true,
            maxAge: env.CLIENT_EXPIRY * 1000,
            sameSite: IS_PRODUCTION ? "none" : "lax",
        })
        .json({ success: true });
};
