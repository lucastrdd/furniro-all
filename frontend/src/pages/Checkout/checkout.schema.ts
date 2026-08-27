import type { DefaultValues } from "react-hook-form";
import { z } from "zod";

export const checkoutSchema = z.object({
    firstName: z.string().trim().min(1, "Enter your first name."),
    lastName: z.string().trim().min(1, "Enter your last name."),
    companyName: z.string().trim(),
    zipCode: z
        .string()
        .trim()
        .regex(/^\d{5}-?\d{3}$/, "Enter a valid ZIP code."),
    countryRegion: z.string().trim().min(1, "Enter your country or region."),
    streetAddress: z.string().trim().min(1, "Enter your street address."),
    townCity: z.string().trim().min(1, "Enter your town or city."),
    province: z.string().trim().min(1, "Enter your province."),
    addOnAddress: z.string().trim(),
    emailAddress: z
        .string()
        .trim()
        .min(1, "Enter your email address.")
        .email("Enter a valid email address."),
    additionalInformation: z.string().trim(),
    paymentMethod: z.enum(["bank-transfer", "cash-on-delivery"], {
        error: "Select a payment method.",
    }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const checkoutDefaultValues: DefaultValues<CheckoutFormData> = {
    firstName: "",
    lastName: "",
    companyName: "",
    zipCode: "",
    countryRegion: "",
    streetAddress: "",
    townCity: "",
    province: "",
    addOnAddress: "",
    emailAddress: "",
    additionalInformation: "",
    paymentMethod: undefined,
};
