import { prisma } from "@repo/database";
import { randomUUID } from "crypto";
import { env } from "../../../configs/env.js";
import { signToken, verifyToken } from "../../../lib/jwt.js";
import { redis } from "../../../lib/redis.js";
import { addDurationToNow } from "../../../utils/add-duration-to-now.js";
import { APIError } from "../../../utils/api-error.js";

export const refreshService = async (
    refreshToken: string
): Promise<{
    newRefreshToken: string;
    newAccessToken: string;
} | null> => {
    const { payload } = await verifyToken(refreshToken);
    const { sub, aud, sid, jti, exp } = payload;
    if (!sub || !aud || !sid || !jti) {
        throw new APIError(401, {
            message: "Invalid token",
        });
    }

    const sessionRecord = await prisma.session.findFirst({
        where: {
            refreshTokenId: jti,
            id: sid,
            accountId: aud as string,
        },
        select: {
            createdAt: true,
            id: true,
            accountId: true,
        },
    });

    if (!sessionRecord) {
        throw new APIError(401, {
            message: "Invalid session",
        });
    }

    const SESSION_AGE_MS = Date.now() - sessionRecord.createdAt.getTime();
    if (SESSION_AGE_MS >= env.SESSION_MAX_AGE * 1000) {
        return null;
    }

    if (await redis.exists(`blacklist-jti:${jti}`)) {
        throw new APIError(403, {
            message: "Token revoked",
        });
    }

    const refreshTokenId = randomUUID();
    const newRefreshToken = await signToken(
        {
            jti: refreshTokenId,
            aud,
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
            refreshTokenId,
        },
    });

    await redis.set(
        `blacklist-jti:${jti}`,
        "BL",
        "EX",
        exp ? Math.ceil(Math.max(0, exp - Math.floor(Date.now() / 1000))) : env.REFRESH_TOKEN_EXPIRY
    );

    return {
        newRefreshToken,
        newAccessToken: await signToken(
            {
                aud,
                sid,
                sub,
            },
            addDurationToNow(env.ACCESS_TOKEN_EXPIRY * 1000)
        ),
    };
};
