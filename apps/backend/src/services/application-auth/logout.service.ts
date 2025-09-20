import { prisma } from "@repo/database";
import { env } from "../../configs/env.js";
import { verifyToken } from "../../lib/jwt.js";
import { redis } from "../../lib/redis.js";
import { APIError } from "../../utils/api-error.js";

export const logoutService = async ({
    ipAddress,
    applicationId,
    sessionId,
    userAgent,
    userId,
    refreshToken,
}: {
    ipAddress?: string;
    applicationId: string;
    sessionId: string;
    userAgent?: string;
    userId: string;
    refreshToken: string;
}) => {
    const { payload } = await verifyToken(refreshToken);
    const { jti, sub, exp, sid } = payload;
    if (!sid || !sub || !jti) {
        throw new APIError(401, {
            message: "Invalid refresh token",
        });
    }

    if (sub !== userId || sid !== sessionId) {
        throw new APIError(401, {
            message: "Invalid or malformed token",
        });
    }

    await prisma.$transaction(async (tx) => {
        await tx.applicationSession.delete({
            where: {
                applicationId,
                refreshTokenId: jti,
                id: sid,
                userId: sub,
            },
            select: {
                id: true,
            },
        });

        await tx.applicationAuditLog.create({
            data: {
                event: "LOGGED_OUT",
                ipAddress,
                userAgent,
                application: {
                    connect: {
                        id: applicationId,
                    },
                },
                user: {
                    connect: {
                        id: sub,
                    },
                },
            },
            select: {
                id: true,
            },
        });
    });

    await redis.set(
        `application-bl-jti:${jti}`,
        "BL",
        "EX",
        exp ? Math.ceil(Math.max(0, exp - Math.floor(Date.now() / 1000))) : env.REFRESH_TOKEN_EXPIRY
    );
};
