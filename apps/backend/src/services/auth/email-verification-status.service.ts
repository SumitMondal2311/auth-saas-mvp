import { redis } from "../../lib/redis";
import { VerifyEmailPayload } from "../../types/verify-email-payload";
import { APIError } from "../../utils/api-error";

export const emailVerificationStatusService = async (token: string) => {
    const data = await redis.get(`email-verification:${token}`);
    if (!data) {
        throw new APIError(422, {
            message: "Invalid or expired token",
        });
    }

    const { email } = JSON.parse(data) as VerifyEmailPayload;
    const [username, domain] = email.split("@");
    return `${username[0]}*****${username[username.length - 1]}@${domain}`;
};
