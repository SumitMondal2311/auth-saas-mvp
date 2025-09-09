import z from "zod";

export const envSchema = z
    .object({
        NODE_ENV: z.enum(["development", "test", "production"]),
        PORT: z.string().transform(Number).default(4321),
        DATABASE_URL: z.string(),
        REDIS_URL: z.string(),
        WEB_ORIGIN: z.url(),
        API_ORIGIN: z.url().optional(),
        ACCESS_TOKEN_EXPIRY: z.string().transform(Number),
        JWT_AUD: z.string(),
        JWT_ISS: z.string(),
        JWT_KID: z.string(),
        EMAIL_VERIFICATION_CODE_EXPIRY: z.string().transform(Number),
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
    email: z.email("Invalid email").transform((email) => email.toLowerCase()),
    password: z
        .string()
        .min(12, "Password must contain at least 12 characters")
        .regex(/[0-9]/, "Password must contain a digit")
        .regex(/[^a-z0-9A-Z]/, "Password must contain a speacial character"),
});
