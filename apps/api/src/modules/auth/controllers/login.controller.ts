import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { IS_PRODUCTION } from "../../../configs/constants.js";
import { env } from "../../../configs/env.js";
import { emailSchema } from "../../../configs/schemas.js";
import { APIError } from "../../../utils/api-error.js";
import { loginService } from "../services/login.service.js";

interface LoginRequest extends Request {
    body: z.infer<typeof emailSchema>;
}

export const loginController = async (req: LoginRequest, res: Response, _next: NextFunction) => {
    const { success, error, data } = emailSchema.safeParse(req.body);
    if (!success) {
        throw new APIError(400, {
            message: error.issues[0].message,
        });
    }

    const { email } = data;
    const { strategy, clientId } = await loginService(email);

    res.status(200)
        .cookie("__client", clientId, {
            secure: IS_PRODUCTION,
            httpOnly: true,
            sameSite: IS_PRODUCTION ? "none" : "lax",
            maxAge: env.CLIENT_EXPIRY * 1000,
        })
        .json({
            strategy,
        });
};
