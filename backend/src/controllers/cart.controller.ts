import type { NextFunction, Request, Response } from "express";
import type { CartService } from "../services/cart.service.js";
import {
    addCartItemSchema,
    mergeCartSchema,
    updateCartItemSchema,
} from "../schemas/cart.schema.js";
import {
    BadRequestException,
    UnauthorizedException,
} from "../middlewares/http-exception.middleware.js";

export default class CartController {
    constructor(private cartService: CartService) {}

    async getCart(req: Request, res: Response, next: NextFunction) {
        try {
            const items = await this.cartService.getCart(this.userId(req));
            res.status(200).json({ items });
        } catch (error) {
            next(error);
        }
    }

    async mergeCart(req: Request, res: Response, next: NextFunction) {
        try {
            const input = this.parse(mergeCartSchema.safeParse(req.body));
            const items = await this.cartService.mergeCart(
                this.userId(req),
                input.items,
            );
            res.status(200).json({ items });
        } catch (error) {
            next(error);
        }
    }

    async addItem(req: Request, res: Response, next: NextFunction) {
        try {
            const input = this.parse(addCartItemSchema.safeParse(req.body));
            const items = await this.cartService.addItem(
                this.userId(req),
                input,
            );
            res.status(200).json({ items });
        } catch (error) {
            next(error);
        }
    }

    async updateItem(req: Request, res: Response, next: NextFunction) {
        try {
            const input = this.parse(updateCartItemSchema.safeParse(req.body));
            const items = await this.cartService.updateQuantity(
                this.userId(req),
                this.itemId(req),
                input.quantity,
            );
            res.status(200).json({ items });
        } catch (error) {
            next(error);
        }
    }

    async removeItem(req: Request, res: Response, next: NextFunction) {
        try {
            const items = await this.cartService.removeItem(
                this.userId(req),
                this.itemId(req),
            );
            res.status(200).json({ items });
        } catch (error) {
            next(error);
        }
    }

    private userId(req: Request): string {
        if (!req.auth) {
            throw new UnauthorizedException("Authentication is required");
        }
        return req.auth.userId;
    }

    private itemId(req: Request): string {
        const itemId = req.params["itemId"];
        const value = Array.isArray(itemId)
            ? (itemId[0] ?? "")
            : (itemId ?? "");

        if (!/^[a-f0-9]{24}$/i.test(value)) {
            throw new BadRequestException("Invalid cart item id");
        }

        return value;
    }

    private parse<T>(result: { success: true; data: T } | { success: false; error: { issues: { message: string }[] } }): T {
        if (!result.success) {
            throw new BadRequestException(
                result.error.issues[0]?.message ?? "Invalid cart data",
            );
        }
        return result.data;
    }
}
