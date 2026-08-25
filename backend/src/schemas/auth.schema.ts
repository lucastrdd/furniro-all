import { z } from "zod";

const emailSchema = z
    .string({ error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Email is invalid")
    .transform((email) => email.toLowerCase());

const passwordSchema = z
    .string({ error: "Password is required" })
    .min(8, "Password must contain at least 8 characters")
    .max(72, "Password must contain at most 72 characters")
    .refine((password) => Buffer.byteLength(password, "utf8") <= 72, {
        message: "Password must contain at most 72 bytes",
    });

export const registerSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z
            .string({ error: "Password confirmation is required" })
            .min(1, "Password confirmation is required"),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const loginSchema = z.object({
    email: emailSchema,
    password: z
        .string({ error: "Password is required" })
        .min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
