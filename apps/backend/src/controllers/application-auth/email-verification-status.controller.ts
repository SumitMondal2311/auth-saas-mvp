import { NextFunction, Request, Response } from "express";
import { emailVerificationStatusService } from "../../services/application-auth/email-verification-status.service.js";
import { handleAsync } from "../../utils/handle-async.js";

const emailVerificationStatusControllerSync = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const flowToken = req.emailVerificationFlowToken || "invalid-token";
    res.status(200).json({
        maskedEmail: await emailVerificationStatusService(flowToken),
    });
};

export const emailVerificationStatusController = handleAsync(emailVerificationStatusControllerSync);
