import { prisma } from "@repo/database";
import { hash } from "argon2";
import { randomUUID } from "crypto";
import { env } from "../../../configs/env.js";
import { redis } from "../../../lib/redis.js";
import { APIError } from "../../../utils/api-error.js";
import { randomOTP } from "../../../utils/random-otp.js";
import { SignupClient } from "../types/signup.type.js";

export const signupService = async ({
    password,
    appId,
    email,
}: {
    email: string;
    appId: string;
    password: string;
}): Promise<string> => {
    const emailAddressRecord = await prisma.applicationEmail.findUnique({
        where: {
            address_applicationId: {
                address: email,
                applicationId: appId,
            },
        },
        select: {
            accountId: true,
        },
    });

    if (emailAddressRecord) {
        throw new APIError(422, {
            message: "Email is already taken",
        });
    }

    const clientId = randomUUID();
    await redis.set(
        `__client:${clientId}`,
        JSON.stringify({
            id: clientId,
            passwordHash: await hash(password),
            emailAddress: email,
            codeHash: await hash(randomOTP(6)),
        } as SignupClient),
        "EX",
        env.CLIENT_EXPIRY
    );

    // TODO: Implement Email Service

    return clientId;
};
