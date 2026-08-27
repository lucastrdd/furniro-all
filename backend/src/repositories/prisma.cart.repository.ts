import type { PrismaClient } from "@prisma/client";
import type { CartRepository } from "./cart.repository.js";
import type { CartItemInput } from "../schemas/cart.schema.js";

export default class PrismaCartRepository implements CartRepository {
    constructor(private prisma: PrismaClient) {}

    findByUserId(userId: string) {
        return this.prisma.productCart.findMany({
            where: { userId },
            orderBy: { id: "asc" },
        });
    }

    findItemById(userId: string, itemId: string) {
        return this.prisma.productCart.findFirst({
            where: { id: itemId, userId },
        });
    }

    findProductBySlug(slug: string) {
        return this.prisma.product.findUnique({ where: { slug } });
    }

    findProductsBySlugs(slugs: string[]) {
        return this.prisma.product.findMany({
            where: { slug: { in: slugs } },
        });
    }

    async addItem(userId: string, item: CartItemInput): Promise<void> {
        await this.prisma.productCart.upsert({
            where: {
                userId_productSlug_currentColor_currentSize: {
                    userId,
                    productSlug: item.productSlug,
                    currentColor: item.color,
                    currentSize: item.size,
                },
            },
            create: {
                userId,
                productSlug: item.productSlug,
                currentColor: item.color,
                currentSize: item.size,
                currentCount: item.quantity,
            },
            update: {
                currentCount: { increment: item.quantity },
            },
        });
    }

    async mergeItems(userId: string, items: CartItemInput[]): Promise<void> {
        await this.prisma.$transaction(
            items.map((item) =>
                this.prisma.productCart.upsert({
                    where: {
                        userId_productSlug_currentColor_currentSize: {
                            userId,
                            productSlug: item.productSlug,
                            currentColor: item.color,
                            currentSize: item.size,
                        },
                    },
                    create: {
                        userId,
                        productSlug: item.productSlug,
                        currentColor: item.color,
                        currentSize: item.size,
                        currentCount: item.quantity,
                    },
                    update: {
                        currentCount: { increment: item.quantity },
                    },
                }),
            ),
        );
    }

    async updateQuantity(
        userId: string,
        itemId: string,
        quantity: number,
    ): Promise<void> {
        await this.prisma.productCart.updateMany({
            where: { id: itemId, userId },
            data: { currentCount: quantity },
        });
    }

    async removeItem(userId: string, itemId: string): Promise<void> {
        await this.prisma.productCart.deleteMany({
            where: { id: itemId, userId },
        });
    }
}
