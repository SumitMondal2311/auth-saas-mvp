import { prisma } from "@repo/database";
import { hash } from "argon2";
import { randomUUID } from "crypto";
import { env } from "../../configs/env.js";
import { redis } from "../../lib/redis.js";
import { APIError } from "../../utils/api-error.js";
import { generateOTP } from "../../utils/generate-otp.js";

export const signupService = async ({
    ipAddress,
    userAgent,
    email,
    password,
}: {
    ipAddress?: string;
    userAgent?: string;
    email: string;
    password: string;
}): Promise<string> => {
    const emailAddressRecord = await prisma.emailAddress.findUnique({
        where: {
            email,
        },
        select: {
            isVerified: true,
        },
    });

    if (emailAddressRecord) {
        if (emailAddressRecord.isVerified) {
            throw new APIError(409, {
                message: "Provided email address is already in use",
            });
        }
    } else {
        await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    id: randomUUID(),
                },
            });
            await tx.emailAddress.create({
                data: {
                    email,
                    user: {
                        connect: {
                            id: newUser.id,
                        },
                    },
                },
            });
            await tx.account.create({
                data: {
                    providerUserId: email,
                    hashedPassword: await hash(password),
                    user: {
                        connect: {
                            id: newUser.id,
                        },
                    },
                },
            });
            await tx.auditLog.create({
                data: {
                    event: "ACCOUNT_CREATED",
                    ipAddress,
                    userAgent,
                    user: {
                        connect: {
                            id: newUser.id,
                        },
                    },
                },
            });
        });
    }

    const verificationCode = generateOTP(6);
    const token = randomUUID();
    await redis.set(
        `verify-email:${token}`,
        JSON.stringify({
            email,
            verificationCode,
        }),
        "EX",
        env.EMAIL_VERIFICATION_TOKEN_EXPIRY
    );

    return token;
};
