import { createPrivateKey, createPublicKey } from "crypto";
import { existsSync, readFileSync } from "fs";
import { JWTVerifyResult, SignJWT, errors, jwtVerify } from "jose";
import { resolve } from "path";
import { env } from "../configs/env.js";
import { AuthJWTPayload } from "../types/auth-jwt-payload.js";
import { APIError } from "../utils/api-error.js";

const secretsDir = resolve(process.cwd(), "secrets");
if (existsSync(secretsDir) === false) {
    console.error("Missing secrets directory");
    process.exit(1);
}

const privatePemPath = resolve(secretsDir, "private.pem");
const publicPemPath = resolve(secretsDir, "public.pem");
if (!existsSync(privatePemPath) || !existsSync(publicPemPath)) {
    console.error("Missing private.pem or public.pem file");
    process.exit(1);
}

const privateKey = createPrivateKey(readFileSync(privatePemPath, "utf8"));
const publicKey = createPublicKey(readFileSync(publicPemPath, "utf8"));

export const signToken = (
    payload: AuthJWTPayload,
    expirationTime: number | string | Date
): Promise<string> => {
    const now = Date.now();
    return new SignJWT({
        kid: env.JWT_KID,
        nbf: now,
        iat: now,
        ...payload,
    } as AuthJWTPayload)
        .setExpirationTime(expirationTime)
        .setProtectedHeader({ alg: "RS256" })
        .sign(privateKey);
};

export const verifyToken = async (token: string): Promise<JWTVerifyResult<AuthJWTPayload>> => {
    try {
        return await jwtVerify(token, publicKey);
    } catch (error) {
        if (
            error instanceof errors.JWTInvalid ||
            error instanceof errors.JWSInvalid ||
            error instanceof errors.JWSSignatureVerificationFailed ||
            error instanceof errors.JWTExpired ||
            error instanceof errors.JWTClaimValidationFailed
        ) {
            throw new APIError(401, {
                message: error.message,
            });
        }

        throw error;
    }
};
