import { NextFunction, Request, Response } from "express";
import { applicationSchema } from "../../configs/schemas.js";
import { createApplicationService } from "../../services/application/create.service.js";
import { APIError } from "../../utils/api-error.js";
import { handleAsync } from "../../utils/handle-async.js";

const createApplicationControllerSync = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.protectedData;
    if (!data) {
        return next(
            new APIError(401, {
                message: "Unauthorized",
            })
        );
    }

    const parsedSchema = applicationSchema.safeParse(req.body);
    if (!parsedSchema.success) {
        return next(
            new APIError(400, {
                message: parsedSchema.error.issues[0].message,
            })
        );
    }

    const { name, usernameLogIn, phoneLogIn, githubLogIn } = parsedSchema.data;
    const application = await createApplicationService({
        userId: data.userId,
        name,
        usernameLogIn,
        phoneLogIn,
        githubLogIn,
    });

    res.status(201).json({
        application,
        message: "Application created successfully",
    });
};

export const createApplicationController = handleAsync(createApplicationControllerSync);
