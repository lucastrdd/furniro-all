import type { AddCartItem, CartItem } from "../context/cartStore";
import api from "./api";

type CartResponse = { items: CartItem[] };

const toCartInput = (item: AddCartItem) => ({
    productSlug: item.slug,
    color: item.color,
    size: item.size,
    quantity: item.quantity,
});

export const getCart = async (): Promise<CartItem[]> => {
    const response = await api.get<CartResponse>("/cart");
    return response.data.items;
};

export const mergeCart = async (items: CartItem[]): Promise<CartItem[]> => {
    const response = await api.post<CartResponse>("/cart/merge", {
        items: items.map(toCartInput),
    });
    return response.data.items;
};

export const addCartItem = async (item: AddCartItem): Promise<CartItem[]> => {
    const response = await api.post<CartResponse>(
        "/cart/items",
        toCartInput(item),
    );
    return response.data.items;
};

export const updateCartItem = async (
    itemId: string,
    quantity: number,
): Promise<CartItem[]> => {
    const response = await api.put<CartResponse>(`/cart/items/${itemId}`, {
        quantity,
    });
    return response.data.items;
};

export const deleteCartItem = async (itemId: string): Promise<CartItem[]> => {
    const response = await api.delete<CartResponse>(`/cart/items/${itemId}`);
    return response.data.items;
};
