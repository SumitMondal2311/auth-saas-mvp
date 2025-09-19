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
        applicationId,
        token,
    }: {
        ipAddress?: string;
        code: string;
        userAgent?: string;
        applicationId: string;
        token: string;
    }): Promise<{
        refreshToken: string;
        accessToken: string;
    }> => {
        const data = await redis.get(`application-email-verification:${token}`);
        if (!data) {
            throw new APIError(400, {
                message: "Invalid or expired token",
            });
        }

        const { hashedPassword, code: storedCode, email } = JSON.parse(data) as VerifyEmailPayload;
        if (!constantTimeCompare(code, storedCode)) {
            throw new APIError(422, {
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
            await tx.applicationUser.create({
                data: {
                    application: {
                        connect: {
                            id: applicationId,
                        },
                    },
                    id: userId,
                },
                select: {
                    id: true,
                },
            });
            await tx.applicationIdentifier.create({
                data: {
                    value: email,
                    isPrimary: true,
                    application: {
                        connect: {
                            id: applicationId,
                        },
                    },
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
            await tx.applicationAuditLog.create({
                data: {
                    event: "EMAIL_VERIFIED",
                    ipAddress,
                    userAgent,
                    application: {
                        connect: {
                            id: applicationId,
                        },
                    },
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
            await tx.applicationAuditLog.create({
                data: {
                    ipAddress,
                    event: "SIGNED_UP",
                    userAgent,
                    application: {
                        connect: {
                            id: applicationId,
                        },
                    },
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
            await tx.applicationAccount.create({
                data: {
                    providerUserId: email,
                    hashedPassword,
                    application: {
                        connect: {
                            id: applicationId,
                        },
                    },
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
            await tx.applicationSession.create({
                data: {
                    id: sessionId,
                    expiresAt: addDurationToNow(env.REFRESH_TOKEN_EXPIRY * 1000),
                    ipAddress,
                    userAgent,
                    refreshTokenId,
                    application: {
                        connect: {
                            id: applicationId,
                        },
                    },
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
            await tx.applicationAuditLog.create({
                data: {
                    ipAddress,
                    event: "LOGGED_IN",
                    userAgent,
                    application: {
                        connect: {
                            id: applicationId,
                        },
                    },
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
        const data = await redis.get(`application-email-verification:${token}`);
        if (!data) {
            throw new APIError(422, {
                message: "Invalid or expired token",
            });
        }

        return (JSON.parse(data) as VerifyEmailPayload).email;
    },
};
