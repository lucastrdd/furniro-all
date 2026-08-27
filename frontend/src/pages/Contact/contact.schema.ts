import type { DefaultValues } from "react-hook-form";
import { z } from "zod";

export const contactSchema = z.object({
    name: z.string().trim().min(1, "Enter your name."),
    email: z
        .string()
        .trim()
        .min(1, "Enter your email address.")
        .email("Enter a valid email address."),
    subject: z.string().trim(),
    message: z.string().trim(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const contactDefaultValues: DefaultValues<ContactFormData> = {
    name: "",
    email: "",
    subject: "",
    message: "",
};
