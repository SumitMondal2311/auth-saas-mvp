import { prisma } from "@repo/database";
import { env } from "../../configs/env.js";
import { verifyRefreshToken } from "../../lib/jwt.js";
import { redis } from "../../lib/redis.js";
import { ProtectedData } from "../../types/protected-data.js";
import { APIError } from "../../utils/api-error.js";

export const logoutService = async ({
    refreshToken,
    ipAddress,
    userAgent,
    protectedData,
}: {
    refreshToken: string;
    protectedData: ProtectedData;
    ipAddress?: string;
    userAgent?: string;
}) => {
    const { payload } = await verifyRefreshToken(refreshToken);
    const { jti, sub, exp, sid } = payload;
    if (!sid || !sub || !jti) {
        throw new APIError(401, {
            message: "Invalid refresh token",
        });
    }

    const { userId, emailAddress, sessionId } = protectedData;
    if (sub !== userId || sid !== sessionId) {
        throw new APIError(401, {
            message: "Invalid or malformed either token",
        });
    }

    await prisma.$transaction(async (tx) => {
        await tx.session.updateMany({
            where: {
                isRevoked: false,
                id: sid,
                userId: sub,
            },
            data: {
                isRevoked: true,
            },
        });
        await tx.auditLog.create({
            data: {
                event: "LOGGED_OUT",
                ipAddress,
                userAgent,
                metadata: {
                    email: emailAddress.email,
                },
                user: {
                    connect: {
                        id: sub,
                    },
                },
            },
        });
    });

    await redis.set(
        `bl-jti:${jti}`,
        "BL",
        "EX",
        exp ? Math.ceil(Math.max(0, exp - Math.floor(Date.now() / 1000))) : env.REFRESH_TOKEN_EXPIRY
    );
};
