import { prisma } from "@repo/database";
import { env } from "../../../configs/env.js";
import { redis } from "../../../lib/redis.js";
import { AuthJWTPayload } from "../../../types/auth-jwt-payload.js";

export const logoutService = async (refreshPayload: AuthJWTPayload) => {
    const { aud, sid, jti, exp } = refreshPayload;
    await prisma.session.delete({
        where: {
            refreshTokenId: jti,
            id: sid,
            accountId: aud as string,
        },
        select: {
            id: true,
        },
    });

    await redis.set(
        `blacklist-jti:${jti}`,
        "BL",
        "EX",
        exp ? Math.ceil(Math.max(0, exp - Math.floor(Date.now() / 1000))) : env.REFRESH_TOKEN_EXPIRY
    );
};
