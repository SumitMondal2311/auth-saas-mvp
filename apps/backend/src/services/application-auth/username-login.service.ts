import { prisma } from "@repo/database";
import { verify } from "argon2";
import { randomUUID } from "crypto";
import { env } from "../../configs/env.js";
import { signToken } from "../../lib/jwt.js";
import { addDurationToNow } from "../../utils/add-duration-to-now.js";
import { APIError } from "../../utils/api-error.js";
import { delay } from "../../utils/delay.js";

export const usernameLoginService = async ({
    ipAddress,
    userAgent,
    applicationId,
    username,
    password,
}: {
    ipAddress?: string;
    userAgent?: string;
    applicationId: string;
    username: string;
    password: string;
}) => {
    const accountRecord = await prisma.applicationAccount.findUnique({
        where: {
            applicationId,
            username,
        },
        select: {
            providerUserId: true,
            userId: true,
            hashedPassword: true,
        },
    });

    if (!accountRecord || !accountRecord.hashedPassword) {
        throw new APIError(422, {
            message: "Account not found",
        });
    }

    const { hashedPassword, userId, providerUserId } = accountRecord;

    const emailAddressRecord = await prisma.applicationIdentifier.findUnique({
        where: {
            value_type_applicationId: {
                applicationId,
                type: "EMAIL",
                value: providerUserId,
            },
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!emailAddressRecord) {
        await delay(50);
        throw new APIError(422, {
            message: "Invalid username or password",
        });
    }

    if ((await verify(hashedPassword, password)) === false) {
        await prisma.auditLog.create({
            data: {
                event: "LOGIN_FAILED",
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
        throw new APIError(422, {
            message: "Invalid username or password",
        });
    }

    const refreshTokenId = randomUUID();
    const sessionId = randomUUID();
    const refreshToken = await signToken(
        {
            jti: refreshTokenId,
            sub: userId,
            sid: sessionId,
        },
        addDurationToNow(env.REFRESH_TOKEN_EXPIRY * 1000)
    );

    await prisma.$transaction(async (tx) => {
        const sessionRecords = await tx.applicationSession.findMany({
            where: {
                userId,
            },
            orderBy: {
                updatedAt: "asc",
            },
            select: {
                id: true,
            },
        });
        if (sessionRecords.length >= env.SESSION_LIMIT) {
            await tx.applicationSession.delete({
                where: {
                    id: sessionRecords[0].id,
                },
                select: {
                    id: true,
                },
            });
        }
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
                event: "LOGGED_IN",
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
    });

    return {
        accessToken: await signToken(
            {
                sub: userId,
                sid: sessionId,
            },
            addDurationToNow(env.ACCESS_TOKEN_EXPIRY * 1000)
        ),
        refreshToken,
    };
};
