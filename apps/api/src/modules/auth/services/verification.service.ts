import { prisma } from "@repo/database";
import { verify } from "argon2";
import { randomUUID } from "crypto";
import { env } from "../../../configs/env.js";
import { signToken } from "../../../lib/jwt.js";
import { redis } from "../../../lib/redis.js";
import { addDurationToNow } from "../../../utils/add-duration-to-now.js";
import { APIError } from "../../../utils/api-error.js";
import { SignupClient } from "../types/signup.type.js";

export const attemptVerificationService = async ({
    ipAddress,
    userAgent,
    code,
    client,
}: {
    ipAddress?: string;
    userAgent?: string;
    code: string;
    client: SignupClient;
}): Promise<{
    refreshToken: string;
    accessToken: string;
}> => {
    const { emailAddress, id, passwordHash, codeHash } = client;
    if ((await verify(codeHash, code)) === false) {
        throw new APIError(422, {
            message: "Incorrect code",
        });
    }

    const sessionId = randomUUID();
    const refreshTokenId = randomUUID();
    const userId = randomUUID();
    const accountId = randomUUID();
    const refreshToken = await signToken(
        {
            jti: refreshTokenId,
            aud: accountId,
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
        await tx.account.create({
            data: {
                id: accountId,
                passwordHash,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
        await tx.email.create({
            data: {
                address: emailAddress,
                isPrimary: true,
                account: {
                    connect: {
                        id: accountId,
                    },
                },
            },
            select: { id: true },
        });
        await tx.session.create({
            data: {
                refreshTokenId,
                ipAddress,
                userAgent,
                id: sessionId,
                expiresAt: addDurationToNow(env.REFRESH_TOKEN_EXPIRY * 1000),
                account: {
                    connect: {
                        id: accountId,
                    },
                },
            },
            select: {
                id: true,
            },
        });

        await redis.del(`__client:${id}`);
    });

    return {
        refreshToken,
        accessToken: await signToken(
            {
                aud: accountId,
                sub: userId,
                sid: sessionId,
            },
            addDurationToNow(env.ACCESS_TOKEN_EXPIRY * 1000)
        ),
    };
};
