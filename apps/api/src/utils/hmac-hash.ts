import { createHmac } from "crypto";
import { env } from "../configs/env.js";

export const hmacHash = (data: Buffer | string): string => {
    return createHmac("sha256", env.HMAC_SECRET_KEY).update(data).digest("hex");
};
