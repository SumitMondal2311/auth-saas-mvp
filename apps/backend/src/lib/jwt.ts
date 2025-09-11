import { createPrivateKey, createPublicKey } from "crypto";
import { existsSync, readFileSync } from "fs";
import { JWTPayload, JWTVerifyResult, SignJWT, errors, jwtVerify } from "jose";
import { resolve } from "path";
import { env } from "../configs/env.js";
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

export interface RefreshJWTPayload extends JWTPayload {
    sid?: string;
}

export const signRefreshToken = (
    payload: RefreshJWTPayload,
    expirationTime: number | string | Date
): Promise<string> => {
    return new SignJWT({
        ...payload,
        iss: env.JWT_ISS,
        kid: env.JWT_KID,
        aud: env.JWT_AUD,
    })
        .setProtectedHeader({ alg: "RS256" })
        .setNotBefore(0)
        .setIssuedAt()
        .setExpirationTime(expirationTime)
        .sign(privateKey);
};

export const verifyRefreshToken = async (
    token: string
): Promise<JWTVerifyResult<RefreshJWTPayload>> => {
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

export interface AccessJWTPayload extends JWTPayload {
    sid?: string;
    emailAddress?: {
        isPrimary: boolean;
        email: string;
    };
}

export const signAccessToken = (
    payload: AccessJWTPayload,
    expirationTime: number | string | Date
): Promise<string> => {
    return new SignJWT({
        ...payload,
        iss: env.JWT_ISS,
        kid: env.JWT_KID,
        aud: env.JWT_AUD,
    })
        .setProtectedHeader({ alg: "RS256" })
        .setNotBefore(0)
        .setIssuedAt()
        .setExpirationTime(expirationTime)
        .sign(privateKey);
};

export const verifyAccessToken = async (
    token: string
): Promise<JWTVerifyResult<AccessJWTPayload>> => {
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
