import type { Product, ProductCart } from "@prisma/client";
import type { CartRepository } from "../repositories/cart.repository.js";
import type { CartItemInput } from "../schemas/cart.schema.js";
import {
    BadRequestException,
    NotFoundException,
} from "../middlewares/http-exception.middleware.js";

type CartResponseItem = {
    id: string;
    productId: string;
    name: string;
    slug: string;
    image: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
    discountPrice?: number | null;
};

export class CartService {
    constructor(private cartRepository: CartRepository) {}

    async getCart(userId: string): Promise<CartResponseItem[]> {
        const cartItems = await this.cartRepository.findByUserId(userId);
        const products = await this.cartRepository.findProductsBySlugs(
            [...new Set(cartItems.map((item) => item.productSlug))],
        );
        const productsBySlug = new Map(
            products.map((product) => [product.slug, product]),
        );

        return cartItems.flatMap((item) => {
            const product = productsBySlug.get(item.productSlug);
            return product ? [this.toResponseItem(item, product)] : [];
        });
    }

    async mergeCart(
        userId: string,
        inputItems: CartItemInput[],
    ): Promise<CartResponseItem[]> {
        const items = this.aggregateItems(inputItems);
        const currentItems = await this.cartRepository.findByUserId(userId);
        const products = await this.cartRepository.findProductsBySlugs(
            [...new Set(items.map((item) => item.productSlug))],
        );
        const productsBySlug = new Map(
            products.map((product) => [product.slug, product]),
        );

        for (const item of items) {
            const product = productsBySlug.get(item.productSlug);
            this.validateProductOption(product, item);

            const currentQuantity =
                currentItems.find(
                    (current) =>
                        current.productSlug === item.productSlug &&
                        current.currentColor === item.color &&
                        current.currentSize === item.size,
                )?.currentCount ?? 0;
            this.validateStock(product, currentQuantity + item.quantity);
        }

        if (items.length > 0) {
            await this.cartRepository.mergeItems(userId, items);
        }

        return this.getCart(userId);
    }

    async addItem(
        userId: string,
        item: CartItemInput,
    ): Promise<CartResponseItem[]> {
        const product = await this.cartRepository.findProductBySlug(
            item.productSlug,
        );
        this.validateProductOption(product, item);

        const currentItems = await this.cartRepository.findByUserId(userId);
        const currentQuantity =
            currentItems.find(
                (current) =>
                    current.productSlug === item.productSlug &&
                    current.currentColor === item.color &&
                    current.currentSize === item.size,
            )?.currentCount ?? 0;
        this.validateStock(product, currentQuantity + item.quantity);

        await this.cartRepository.addItem(userId, item);
        return this.getCart(userId);
    }

    async updateQuantity(
        userId: string,
        itemId: string,
        quantity: number,
    ): Promise<CartResponseItem[]> {
        const item = await this.cartRepository.findItemById(userId, itemId);
        if (!item) {
            throw new NotFoundException("Cart item not found");
        }

        const product = await this.cartRepository.findProductBySlug(
            item.productSlug,
        );
        if (!product) {
            throw new NotFoundException("Product not found");
        }
        this.validateStock(product, quantity);

        await this.cartRepository.updateQuantity(userId, itemId, quantity);
        return this.getCart(userId);
    }

    async removeItem(
        userId: string,
        itemId: string,
    ): Promise<CartResponseItem[]> {
        const item = await this.cartRepository.findItemById(userId, itemId);
        if (!item) {
            throw new NotFoundException("Cart item not found");
        }

        await this.cartRepository.removeItem(userId, itemId);
        return this.getCart(userId);
    }

    private aggregateItems(items: CartItemInput[]): CartItemInput[] {
        const aggregated = new Map<string, CartItemInput>();

        for (const item of items) {
            const key = `${item.productSlug}:${item.color}:${item.size}`;
            const current = aggregated.get(key);
            aggregated.set(key, {
                ...item,
                quantity: item.quantity + (current?.quantity ?? 0),
            });
        }

        return [...aggregated.values()];
    }

    private validateProductOption(
        product: Product | null | undefined,
        item: CartItemInput,
    ): asserts product is Product {
        if (!product) {
            throw new NotFoundException("Product not found");
        }
        if (!product.colors.includes(item.color)) {
            throw new BadRequestException("Invalid product color");
        }
        if (!product.sizes.includes(item.size)) {
            throw new BadRequestException("Invalid product size");
        }
    }

    private validateStock(product: Product, quantity: number): void {
        if (quantity > product.stock) {
            throw new BadRequestException("Requested quantity exceeds stock");
        }
    }

    private toResponseItem(
        item: ProductCart,
        product: Product,
    ): CartResponseItem {
        return {
            id: item.id,
            productId: product.id,
            name: product.name,
            slug: product.slug,
            image: product.images[0] ?? "",
            color: item.currentColor,
            size: item.currentSize,
            quantity: item.currentCount,
            price: product.price,
            discountPrice: product.discountPrice,
        };
    }
}
