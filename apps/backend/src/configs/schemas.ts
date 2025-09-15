import z from "zod";

export const envSchema = z
    .object({
        NODE_ENV: z.enum(["development", "test", "production"]),
        PORT: z.string().default("4321").transform(Number),
        DATABASE_URL: z.string(),
        REDIS_URL: z.string(),
        WEB_ORIGIN: z.string().url(),
        API_ORIGIN: z.string().url().optional(),
        ACCESS_TOKEN_EXPIRY: z.string().transform(Number),
        JWT_AUD: z.string(),
        JWT_ISS: z.string(),
        JWT_KID: z.string(),
        EMAIL_VERIFICATION_CODE_EXPIRY: z.string().transform(Number),
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
    code: z.string().nonempty("Code required").min(6, "Incorrect code").max(6, "Incorrect code"),
});

export const authSchema = z.object({
    email: z
        .string()
        .email("Invalid email")
        .transform((email) => email.toLowerCase()),
    password: z.string().min(12, "Password must contain at least 12 characters"),
});

export const applicationSchema = z.object({
    name: z.string().nonempty("Name required"),
    username: z.boolean().default(false),
    phone: z.boolean().default(false),
    github: z.boolean().default(false),
});
