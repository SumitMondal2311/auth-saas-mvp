import { prisma } from "@repo/database";
import { hash } from "argon2";
import { randomUUID } from "crypto";
import { env } from "../../configs/env.js";
import { redis } from "../../lib/redis.js";
import { VerifyEmailPayload } from "../../types/verify-email-payload.js";
import { APIError } from "../../utils/api-error.js";
import { delay } from "../../utils/delay.js";
import { generateOTP } from "../../utils/generate-otp.js";

export const signupService = async (email: string, password: string): Promise<string> => {
    const emailAddressRecord = await prisma.identifier.findUnique({
        where: {
            value_type: {
                type: "EMAIL",
                value: email,
            },
        },
        select: {
            id: true,
        },
    });

    if (emailAddressRecord) {
        await delay(50);
        throw new APIError(409, {
            message: "Email is already registered",
        });
    }

    const token = randomUUID();
    await redis.set(
        `email-verification:${token}`,
        JSON.stringify({
            email,
            code: generateOTP(6),
            hashedPassword: await hash(password),
        } as VerifyEmailPayload),
        "EX",
        env.EMAIL_VERIFICATION_CODE_EXPIRY
    );

    return token;
};
