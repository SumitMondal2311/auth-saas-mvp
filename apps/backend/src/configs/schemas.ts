import z from "zod";

export const envSchema = z
    .object({
        EMAIL_VERIFICATION_CODE_EXPIRY: z.string().transform(Number),
        NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
        ACCESS_TOKEN_EXPIRY: z.string().transform(Number),
        PORT: z.string().default("4321").transform(Number),
        DATABASE_URL: z.string(),
        REDIS_URL: z.string(),
        WEB_ORIGIN: z.string().url(),
        API_ORIGIN: z.string().url().optional(),
        JWT_KID: z.string(),
        PHONE_LOGIN_CODE_EXPIRY: z.string().transform(Number),
        SESSION_LIMIT: z.string().transform(Number),
        DATABASE_MAX_RETRIES: z.string().transform(Number),
        REFRESH_TOKEN_EXPIRY: z.string().transform(Number),
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
        .string({
            required_error: "Code required",
        })
        .trim()
        .min(6, "Incorrect code")
        .max(6, "Incorrect code"),
});

export const emailPasswordSchema = z.object({
    email: z
        .string({
            required_error: "Email required",
        })
        .trim()
        .email("Invalid email")
        .transform((email) => email.toLowerCase()),
    password: z
        .string({
            required_error: "Password required",
        })
        .trim()
        .min(12, "Password must contain at least 12 characters"),
});

export const applicationSchema = z.object({
    username: z.boolean().default(false),
    phone: z.boolean().default(false),
    github: z.boolean().default(false),
    name: z.string({ required_error: "Name required" }),
});

export const applicationMiddlewareSchema = z.object({
    publicKey: z
        .string({
            required_error: "Public key required",
        })
        .startsWith("pk_"),
});

export const usernamePasswordSchema = z.object({
    username: z
        .string({
            required_error: "Username required",
        })
        .regex(/^[a-z0-9A-Z_]+$/, "Invalid username"),
    password: z
        .string({
            required_error: "Password required",
        })
        .min(12, "Password must contain at least 12 characters"),
});
