import { z } from "zod";

const cartItemSchema = z.object({
    productSlug: z.string().trim().min(1, "Product is required"),
    color: z.string().trim().min(1, "Color is required"),
    size: z.string().trim().min(1, "Size is required"),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const mergeCartSchema = z.object({
    items: z.array(cartItemSchema),
});

export const addCartItemSchema = cartItemSchema;

export const updateCartItemSchema = z.object({
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
