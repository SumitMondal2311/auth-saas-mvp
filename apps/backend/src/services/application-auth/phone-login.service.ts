import { prisma } from "@repo/database";
import { hash } from "argon2";
import { randomUUID } from "crypto";
import { env } from "../../configs/env.js";
import { redis } from "../../lib/redis.js";
import { PhoneLoginPayload } from "../../types/phone-login-payload.js";
import { APIError } from "../../utils/api-error.js";
import { delay } from "../../utils/delay.js";
import { generateOTP } from "../../utils/generate-otp.js";

export const phoneLoginService = async ({
    applicationId,
    phone,
}: {
    applicationId: string;
    phone: string;
}) => {
    const phoneNumberRecord = await prisma.applicationIdentifier.findUnique({
        where: {
            value_type_applicationId: {
                value: phone,
                type: "PHONE",
                applicationId,
            },
        },
        select: {
            userId: true,
        },
    });

    if (!phoneNumberRecord) {
        await delay(50);
        throw new APIError(422, {
            message: "Invalid phone number",
        });
    }

    const token = randomUUID();
    const otp = generateOTP(6);
    await redis.set(
        `application-phone-login:${token}`,
        JSON.stringify({
            code: await hash(otp),
            userId: phoneNumberRecord.userId,
        } as PhoneLoginPayload),
        "EX",
        env.PHONE_LOGIN_CODE_EXPIRY
    );

    // TODO: implement SMS provider

    return token;
};
