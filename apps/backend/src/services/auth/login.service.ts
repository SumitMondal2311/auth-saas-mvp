import { prisma } from "@repo/database";
import { verify } from "argon2";
import { randomUUID } from "crypto";
import { env } from "../../configs/env.js";
import { signToken } from "../../lib/jwt.js";
import { addDurationToNow } from "../../utils/add-duration-to-now.js";
import { APIError } from "../../utils/api-error.js";
import { delay } from "../../utils/delay.js";

export const loginService = async ({
    ipAddress,
    userAgent,
    email,
    password,
}: {
    ipAddress?: string;
    userAgent?: string;
    email: string;
    password: string;
}): Promise<{
    refreshToken: string;
    accessToken: string;
}> => {
    const emailAddressRecord = await prisma.identifier.findUnique({
        where: {
            value_type: {
                type: "EMAIL",
                value: email,
            },
        },
        select: {
            userId: true,
        },
    });

    if (!emailAddressRecord) {
        await delay(50);
        throw new APIError(401, {
            message: "Invalid email or password",
        });
    }

    const { userId } = emailAddressRecord;

    const accountRecord = await prisma.account.findUnique({
        where: {
            providerUserId_provider: {
                provider: "LOCAL",
                providerUserId: email,
            },
        },
        select: {
            hashedPassword: true,
        },
    });

    if (!accountRecord || !accountRecord.hashedPassword) {
        await delay(50);
        throw new APIError(401, {
            message: "Invalid email or password",
        });
    }

    const passwordMatched = await verify(accountRecord.hashedPassword, password);
    if (!passwordMatched) {
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
        throw new APIError(401, {
            message: "Invalid email or password",
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
        const sessionRecords = await tx.session.findMany({
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
            await tx.session.delete({
                where: {
                    id: sessionRecords[0].id,
                },
                select: {
                    id: true,
                },
            });
        }
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
                loginMethod: true,
            },
        });
        await tx.auditLog.create({
            data: {
                event: "LOGGED_IN",
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
};
