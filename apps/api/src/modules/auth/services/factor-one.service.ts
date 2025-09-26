import { prisma } from "@repo/database";
import { verify } from "argon2";
import { randomUUID } from "crypto";
import { env } from "../../../configs/env.js";
import { passwordSchema, verificationCodeSchema } from "../../../configs/schemas.js";
import { signToken } from "../../../lib/jwt.js";
import { addDurationToNow } from "../../../utils/add-duration-to-now.js";
import { APIError } from "../../../utils/api-error.js";
import { hmacHash } from "../../../utils/hmac-hash.js";
import { AttemptFactorOneInput, FactorOneClient } from "../types/factor-one.type.js";

export const attemptFactorOneService = async ({
    ipAddress,
    userAgent,
    input,
    client,
}: {
    client: FactorOneClient;
    ipAddress?: string;
    userAgent?: string;
    input: AttemptFactorOneInput;
}): Promise<{
    accessToken: string;
    refreshToken: string;
}> => {
    const { accountId, userId, strategy } = client;
    if (strategy === "email_code") {
        const { success, error, data } = verificationCodeSchema.safeParse(input);
        if (!success) {
            throw new APIError(400, {
                message: error.issues[0].message,
            });
        }

        const { codeHash } = client;
        if (hmacHash(data.code) !== codeHash) {
            throw new APIError(400, {
                message: "Incorrect code",
            });
        }
    } else {
        const { success, error, data } = passwordSchema.safeParse(input);
        if (!success) {
            throw new APIError(400, {
                message: error.issues[0].message,
            });
        }

        const { passwordHash } = client;
        if ((await verify(passwordHash, data.password)) === false) {
            throw new APIError(400, {
                message: "Incorrect password",
            });
        }
    }

    const refreshTokenId = randomUUID();
    const sessionId = randomUUID();
    const refreshToken = await signToken(
        {
            jti: refreshTokenId,
            aid: accountId,
            sub: userId,
            sid: sessionId,
        },
        addDurationToNow(env.REFRESH_TOKEN_EXPIRY * 1000)
    );

    await prisma.$transaction(async (tx) => {
        const sessionRecords = await tx.session.findMany({
            where: {
                accountId,
            },
            orderBy: {
                updatedAt: "asc",
            },
            select: {
                id: true,
            },
        });
        if (sessionRecords.length >= env.MAX_SESSIONS_PER_ACCOUNT) {
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
    });

    return {
        refreshToken,
        accessToken: await signToken(
            {
                aid: accountId,
                sub: userId,
                sid: sessionId,
            },
            addDurationToNow(env.ACCESS_TOKEN_EXPIRY * 1000)
        ),
    };
};
