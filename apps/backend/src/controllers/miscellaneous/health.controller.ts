import { prisma } from "@repo/database";
import { Request, Response } from "express";
import { handleAsync } from "../../utils/handle-async.js";

const healthControllerSync = async (_req: Request, res: Response) => {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
        message: "OK",
        uptime: process.uptime(),
        timestamp: new Date(),
    });
};

export const healthController = handleAsync(healthControllerSync);
