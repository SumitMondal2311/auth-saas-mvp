import { prisma } from "@repo/database";
import { randomUUID } from "crypto";
import { env } from "../../../configs/env.js";
import { redis } from "../../../lib/redis.js";
import { APIError } from "../../../utils/api-error.js";
import { hmacHash } from "../../../utils/hmac-hash.js";
import { randomOTP } from "../../../utils/random-otp.js";
import { FactorOneClient } from "../types/factor-one.type.js";

export const loginService = async (
    email: string
): Promise<{
    strategy: "email_code" | "password";
    clientId: string;
}> => {
    const accountRecord = await prisma.account.findFirst({
        where: {
            emailAddresses: {
                some: {
                    address: email,
                },
            },
        },
        select: {
            userId: true,
            id: true,
            passwordHash: true,
        },
    });

    if (!accountRecord) {
        throw new APIError(422, {
            message: "Account does not exist",
        });
    }

    const { userId, id: accountId, passwordHash } = accountRecord;

    const clientId = randomUUID();
    if (!passwordHash) {
        await redis.set(
            `__client:${clientId}`,
            JSON.stringify({
                strategy: "email_code",
                accountId,
                userId,
                id: clientId,
                emailAddress: email,
                codeHash: hmacHash(randomOTP(6)),
            } as FactorOneClient),
            "EX",
            env.CLIENT_EXPIRY
        );

        // TODO: Implement email service //

        return {
            strategy: "email_code",
            clientId,
        };
    }

    await redis.set(
        `__client:${clientId}`,
        JSON.stringify({
            emailAddress: email,
            accountId,
            userId,
            passwordHash,
            id: clientId,
            strategy: "password",
        } as FactorOneClient),
        "EX",
        env.CLIENT_EXPIRY
    );

    return {
        strategy: "password",
        clientId,
    };
};
