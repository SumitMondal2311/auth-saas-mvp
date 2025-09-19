import { z } from "zod";

export const emailVerificationSchema = z.object({
    code: z.string().min(6, "Code should be exactly 6 characters long"),
});

export const authSchema = z.object({
    email: z
        .string()
        .email("Invalid email")
        .transform((email) => email.toLowerCase()),
    password: z.string().min(12, "Password must contain at least 12 characters"),
});

export const createApplicationSchema = z.object({
    username: z.boolean(),
    phone: z.boolean(),
    github: z.boolean(),
    name: z.string().nonempty("required"),
});
