import type { Product, ProductCart } from "@prisma/client";
import type { CartItemInput } from "../schemas/cart.schema.js";

export interface CartRepository {
    findByUserId(userId: string): Promise<ProductCart[]>;
    findItemById(userId: string, itemId: string): Promise<ProductCart | null>;
    findProductBySlug(slug: string): Promise<Product | null>;
    findProductsBySlugs(slugs: string[]): Promise<Product[]>;
    addItem(userId: string, item: CartItemInput): Promise<void>;
    mergeItems(userId: string, items: CartItemInput[]): Promise<void>;
    updateQuantity(userId: string, itemId: string, quantity: number): Promise<void>;
    removeItem(userId: string, itemId: string): Promise<void>;
}
