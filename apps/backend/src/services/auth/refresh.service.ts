import { prisma } from "@repo/database";
import { randomUUID } from "crypto";
import { env } from "../../configs/env.js";
import { signRefreshToken, verifyRefreshToken } from "../../lib/jwt.js";
import { redis } from "../../lib/redis.js";
import { addDurationToNow } from "../../utils/add-duration-to-now.js";
import { APIError } from "../../utils/api-error.js";

export const refreshService = async (
    refreshToken: string
): Promise<{
    newRefreshToken: string;
    userId: string;
    emailAddress: {
        isPrimary: boolean;
        email: string;
    };
    sessionId: string;
}> => {
    const { payload } = await verifyRefreshToken(refreshToken);
    const { sid, sub, jti, exp } = payload;
    if (!sid || !sub || !jti) {
        throw new APIError(401, {
            message: "Invalid refresh token",
        });
    }

    const sessionRecord = await prisma.session.findFirst({
        where: {
            refreshTokenId: jti,
            id: sid,
            userId: sub,
        },
        select: {
            emailAddress: {
                select: {
                    isPrimary: true,
                    email: true,
                },
            },
        },
    });

    if (!sessionRecord) {
        throw new APIError(404, {
            message: "Session not found",
        });
    }

    if (await redis.exists(`bl-jti:${jti}`)) {
        throw new APIError(403, {
            message: "Revoked: Refresh token is no longer valid",
        });
    }

    const newRefreshTokenId = randomUUID();
    const newRefreshToken = await signRefreshToken(
        {
            jti: newRefreshTokenId,
            sub,
            sid,
        },
        addDurationToNow(env.REFRESH_TOKEN_EXPIRY * 1000)
    );

    await prisma.session.update({
        where: {
            id: sid,
        },
        data: {
            refreshTokenId: newRefreshTokenId,
        },
    });

    await redis.set(
        `bl-jti:${jti}`,
        "revoked",
        "EX",
        exp ? Math.ceil(Math.max(0, exp - Math.floor(Date.now() / 1000))) : env.REFRESH_TOKEN_EXPIRY
    );

    const { emailAddress } = sessionRecord;

    return {
        sessionId: sid,
        newRefreshToken,
        userId: sub,
        emailAddress,
    };
};
