import { AccountProvider, prisma } from "@repo/database";
import { verify } from "argon2";
import { randomUUID } from "crypto";
import { env } from "../../configs/env.js";
import { signRefreshToken } from "../../lib/jwt.js";
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
    userId: string;
    isPrimaryEmail: boolean;
    sessionId: string;
}> => {
    const emailAddressRecord = await prisma.emailAddress.findUnique({
        where: {
            email,
        },
        select: {
            isPrimary: true,
            userId: true,
        },
    });

    if (!emailAddressRecord) {
        await delay(50);
        throw new APIError(401, {
            message: "Invalid credentials",
        });
    }

    const { isPrimary, userId } = emailAddressRecord;

    const auditLogFailedLogin = () => {
        return prisma.auditLog.create({
            data: {
                event: "LOGIN_FAILED",
                ipAddress,
                userAgent,
                metadata: {
                    email,
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
    };

    const accountRecord = await prisma.account.findUnique({
        where: {
            providerUserId_provider: {
                provider: AccountProvider.LOCAL,
                providerUserId: email,
            },
        },
        select: {
            hashedPassword: true,
        },
    });

    if (!accountRecord) {
        await auditLogFailedLogin();
        throw new APIError(401, {
            message: "Invalid credentials",
        });
    }

    const passwordMatched = await verify(accountRecord.hashedPassword || "", password);
    if (!passwordMatched) {
        await auditLogFailedLogin();
        throw new APIError(401, {
            message: "Invalid credentials",
        });
    }

    const refreshTokenId = randomUUID();
    const sessionId = randomUUID();
    const refreshToken = await signRefreshToken(
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
            await tx.session.update({
                where: {
                    id: sessionRecords[0].id,
                },
                select: {
                    id: true,
                },
                data: {
                    isRevoked: true,
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
                emailAddress: {
                    connect: {
                        email,
                    },
                },
            },
            select: {
                id: true,
            },
        });
        await tx.auditLog.create({
            data: {
                event: "LOGGED_IN",
                ipAddress,
                userAgent,
                metadata: {
                    email,
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
        refreshToken,
        userId,
        isPrimaryEmail: isPrimary,
        sessionId,
    };
};
