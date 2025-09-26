import z from "zod";

export const envSchema = z
    .object({
        NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
        PORT: z.string().default("4321").transform(Number),

        DATABASE_URL: z.string(),
        DATABASE_MAX_RETRIES: z.string().transform(Number),

        REDIS_URL: z.string(),

        WEB_ORIGIN: z.string().url(),
        API_ORIGIN: z.string().url().optional(),

        JWT_KID: z.string(),

        HMAC_SECRET_KEY: z.string(),

        SESSION_MAX_AGE: z.string().transform(Number),
        CLIENT_EXPIRY: z.string().transform(Number),
        REFRESH_TOKEN_EXPIRY: z.string().transform(Number),
        MAX_SESSIONS_PER_ACCOUNT: z.string().transform(Number),
        ACCESS_TOKEN_EXPIRY: z.string().transform(Number),
    })
    .superRefine((arg, ctx) => {
        if (!arg.API_ORIGIN) {
            if (arg.NODE_ENV === "production") {
                ctx.addIssue({
                    message: "Invalid input: expected string, received undefined",
                    code: "custom",
                    path: ["API_ORIGIN"],
                });
            } else {
                arg.API_ORIGIN = `http://localhost:${arg.PORT}`;
            }
        }
    });

export const verificationCodeSchema = z.object({
    code: z
        .string({ required_error: "Code required" })
        .min(6, "Incorrect code")
        .max(6, "Incorrect code"),
});

export const emailSchema = z.object({
    email: z.string({ required_error: "Email required" }).email("Invalid email"),
});

export const passwordSchema = z.object({
    password: z
        .string({ required_error: "Password required" })
        .min(12, "Password must contain at least 12 characters"),
});

export const applicationSchema = z.object({
    username: z.boolean().default(false),
    name: z.string({ required_error: "Name required" }),
    google: z.boolean().default(false),
    github: z.boolean().default(false),
});

export const publishableKeySchema = z.object({
    publishableKey: z.string({ required_error: "Publishable key required" }).startsWith("pk_"),
});

export const usernameSchema = z.object({
    username: z
        .string({ required_error: "Username required" })
        .regex(/^[a-z0-9A-Z_]+$/, "Invalid username"),
});
