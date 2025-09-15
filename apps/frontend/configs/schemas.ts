import { z } from "zod";

export const emailVerificationSchema = z.object({
    code: z.string().min(6, "Code should be exactly 6 characters long"),
});

export const authenticationSchema = z.object({
    email: z
        .string()
        .email("Invalid email")
        .transform((email) => email.toLowerCase()),
    password: z.string().min(12, "Password must contain at least 12 characters"),
});

export const applicationSchema = z.object({
    name: z.string().nonempty("required"),
    username: z.boolean().default(false),
    phone: z.boolean().default(false),
    github: z.boolean().default(false),
});
