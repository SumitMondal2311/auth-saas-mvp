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
        userId: string;
        sessionId: string;
    }> => {
        const data = await redis.get(`verify-email:${token}`);
        if (!data) {
            throw new APIError(400, {
                message: "Invalid or expired token",
            });
        }

        const { email, verificationCode } = JSON.parse(data) as VerifyEmailPayload;
        const emailAddressRecord = await prisma.emailAddress.findFirst({
            where: {
                email,
                isVerified: false,
            },
            select: {
                isVerified: true,
                id: true,
                userId: true,
            },
        });

        if (!emailAddressRecord) {
            throw new APIError(400, {
                message: "Email might already be verified",
            });
        }

        if (!constantTimeCompare(code, verificationCode)) {
            throw new APIError(400, {
                message: "Incorrect code",
            });
        }

        const { id: emailAddressId, userId } = emailAddressRecord;

        const refreshTokenId = randomUUID();
        const sessionId = randomUUID();
        const refreshToken = await signToken(
            {
                jti: refreshTokenId,
                typ: "refresh",
                sub: userId,
                sid: sessionId,
            },
            addDurationToNow(env.REFRESH_TOKEN_EXPIRY * 1000)
        );

        await prisma.$transaction(async (tx) => {
            await tx.emailAddress.update({
                where: {
                    id: emailAddressId,
                },
                data: {
                    isVerified: true,
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
                    emailAddress: {
                        connect: {
                            id: emailAddressId,
                        },
                    },
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
            });
            await redis.del(`verify-email:${token}`);
        });

        return {
            sessionId,
            userId,
            refreshToken,
        };
    },
    GET: async (token: string): Promise<string> => {
        const data = await redis.get(`verify-email:${token}`);
        if (!data) {
            throw new APIError(400, {
                message: "Invalid or expired token",
            });
        }

        const { email } = JSON.parse(data) as VerifyEmailPayload;
        return email;
    },
};
