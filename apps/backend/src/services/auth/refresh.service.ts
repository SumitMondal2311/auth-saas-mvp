import { prisma } from "@repo/database";
import { randomUUID } from "crypto";
import { env } from "../../configs/env.js";
import { signToken, verifyToken } from "../../lib/jwt.js";
import { redis } from "../../lib/redis.js";
import { addDurationToNow } from "../../utils/add-duration-to-now.js";
import { APIError } from "../../utils/api-error.js";

export const refreshService = async (
    refreshToken: string
): Promise<{
    newRefreshToken: string;
    newAccessToken: string;
}> => {
    const { payload } = await verifyToken(refreshToken);
    const { sid, sub, jti, exp } = payload;
    if (!sid || !sub || !jti) {
        throw new APIError(401, {
            message: "Invalid token",
        });
    }

    const sessionRecord = await prisma.session.findFirst({
        where: {
            refreshTokenId: jti,
            id: sid,
            userId: sub,
        },
        select: {
            id: true,
        },
    });

    if (!sessionRecord) {
        throw new APIError(404, {
            message: "Session not found",
        });
    }

    if (await redis.exists(`bl-jti:${jti}`)) {
        throw new APIError(403, {
            message: "Token is no longer valid",
        });
    }

    const refreshTokenId = randomUUID();
    const newRefreshToken = await signToken(
        {
            jti: refreshTokenId,
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
        `bl-jti:${jti}`,
        "BL",
        "EX",
        exp ? Math.ceil(Math.max(0, exp - Math.floor(Date.now() / 1000))) : env.REFRESH_TOKEN_EXPIRY
    );

    return {
        newRefreshToken,
        newAccessToken: await signToken(
            {
                sid,
                sub,
            },
            addDurationToNow(env.ACCESS_TOKEN_EXPIRY * 1000)
        ),
    };
};
