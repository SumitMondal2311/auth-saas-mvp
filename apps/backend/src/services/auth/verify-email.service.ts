import { prisma } from "@repo/database";
import { randomUUID } from "crypto";
import { env } from "../../configs/env.js";
import { signToken } from "../../lib/jwt.js";
import { redis } from "../../lib/redis.js";
import { VerifyEmailPayload } from "../../types/verify-email-payload.js";
import { addDurationToNow } from "../../utils/add-duration-to-now.js";
import { APIError } from "../../utils/api-error.js";
import { constantTimeCompare } from "../../utils/constant-time-compare.js";

export const verifyEmailService = {
    POST: async ({
        ipAddress,
        code,
        userAgent,
        token,
    }: {
        ipAddress?: string;
        code: string;
        userAgent?: string;
        token: string;
    }): Promise<{
        refreshToken: string;
        accessToken: string;
    }> => {
        const data = await redis.get(`email-verification:${token}`);
        if (!data) {
            throw new APIError(400, {
                message: "Invalid or expired token",
            });
        }

        const { hashedPassword, code: storedCode, email } = JSON.parse(data) as VerifyEmailPayload;
        if (!constantTimeCompare(code, storedCode)) {
            throw new APIError(400, {
                message: "Incorrect code",
            });
        }

        const sessionId = randomUUID();
        const refreshTokenId = randomUUID();
        const userId = randomUUID();
        const refreshToken = await signToken(
            {
                jti: refreshTokenId,
                sub: userId,
                sid: sessionId,
            },
            addDurationToNow(env.REFRESH_TOKEN_EXPIRY * 1000)
        );

        await prisma.$transaction(async (tx) => {
            await tx.user.create({
                data: {
                    id: userId,
                },
                select: {
                    id: true,
                },
            });
            await tx.identifier.create({
                data: {
                    value: email,
                    isPrimary: true,
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                    type: "EMAIL",
                },
                select: {
                    id: true,
                },
            });
            await tx.auditLog.create({
                data: {
                    event: "EMAIL_VERIFIED",
                    ipAddress,
                    userAgent,
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                },
                select: {
                    id: true,
                },
            });
            await tx.account.create({
                data: {
                    providerUserId: email,
                    hashedPassword,
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                },
                select: {
                    id: true,
                },
            });
            await tx.auditLog.create({
                data: {
                    ipAddress,
                    event: "SIGNED_UP",
                    userAgent,
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                },
                select: {
                    id: true,
                },
            });
            await tx.session.create({
                data: {
                    id: sessionId,
                    expiresAt: addDurationToNow(env.REFRESH_TOKEN_EXPIRY * 1000),
                    ipAddress,
                    userAgent,
                    refreshTokenId,
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                },
                select: {
                    id: true,
                },
            });
            await tx.auditLog.create({
                data: {
                    ipAddress,
                    event: "LOGGED_IN",
                    userAgent,
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                },
                select: {
                    id: true,
                },
            });

            await redis.del(`email-verification:${token}`);
        });

        return {
            refreshToken,
            accessToken: await signToken(
                {
                    sid: sessionId,
                    sub: userId,
                },
                addDurationToNow(env.ACCESS_TOKEN_EXPIRY * 1000)
            ),
        };
    },
    GET: async (token: string): Promise<string> => {
        const data = await redis.get(`email-verification:${token}`);
        if (!data) {
            throw new APIError(400, {
                message: "Invalid or expired token",
            });
        }

        return (JSON.parse(data) as VerifyEmailPayload).email;
    },
};
