import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    addCartItem,
    deleteCartItem,
    getCart,
    mergeCart,
    updateCartItem,
} from "../services/cart.service";

export type CartItem = {
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

export type AddCartItem = Omit<CartItem, "id">;

type CartMode = "guest" | "authenticated";

type CartStore = {
    items: CartItem[];
    isDrawerOpen: boolean;
    isSyncing: boolean;
    mode: CartMode;
    userId: string | null;
    addItem: (item: AddCartItem) => void;
    updateQuantity: (id: string, quantity: number) => void;
    removeItem: (id: string) => void;
    openDrawer: () => void;
    closeDrawer: () => void;
};

const createItemId = (item: AddCartItem) =>
    `${item.productId}:${item.color}:${item.size}`;

let syncQueue = Promise.resolve();
let connection: { userId: string; promise: Promise<void> } | null = null;
let sessionGeneration = 0;

const replaceWithServerCart = (operation: () => Promise<CartItem[]>) => {
    const generation = sessionGeneration;
    syncQueue = syncQueue.then(async () => {
        if (
            generation !== sessionGeneration ||
            useCartStore.getState().mode !== "authenticated"
        ) {
            return;
        }

        useCartStore.setState({ isSyncing: true });

        try {
            const items = await operation();
            if (generation === sessionGeneration) {
                useCartStore.setState({ items });
            }
        } catch {
            try {
                const items = await getCart();
                if (generation === sessionGeneration) {
                    useCartStore.setState({ items });
                }
            } catch {
                return;
            } finally {
                if (generation === sessionGeneration) {
                    useCartStore.setState({ isSyncing: false });
                }
            }
            return;
        }

        if (generation === sessionGeneration) {
            useCartStore.setState({ isSyncing: false });
        }
    });
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isDrawerOpen: false,
            isSyncing: false,
            mode: "guest",
            userId: null,

            addItem: (item) => {
                set((state) => {
                    const id = createItemId(item);
                    const existingItem = state.items.find(
                        (current) => current.id === id,
                    );

                    if (existingItem) {
                        return {
                            items: state.items.map((current) =>
                                current.id === id
                                    ? {
                                          ...current,
                                          ...item,
                                          id,
                                          quantity:
                                              current.quantity + item.quantity,
                                      }
                                    : current,
                            ),
                        };
                    }

                    return { items: [...state.items, { ...item, id }] };
                });

                if (get().mode === "authenticated") {
                    replaceWithServerCart(() => addCartItem(item));
                }
            },

            updateQuantity: (id, quantity) => {
                const normalizedQuantity = Math.max(1, quantity);
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id
                            ? { ...item, quantity: normalizedQuantity }
                            : item,
                    ),
                }));

                if (get().mode === "authenticated") {
                    replaceWithServerCart(() =>
                        updateCartItem(id, normalizedQuantity),
                    );
                }
            },

            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                }));

                if (get().mode === "authenticated") {
                    replaceWithServerCart(() => deleteCartItem(id));
                }
            },

            openDrawer: () => set({ isDrawerOpen: true }),
            closeDrawer: () => set({ isDrawerOpen: false }),
        }),
        {
            name: "furniro-cart",
            partialize: (state) => ({
                items: state.mode === "guest" ? state.items : [],
            }),
        },
    ),
);

export const connectUserCart = async (userId: string): Promise<void> => {
    const state = useCartStore.getState();

    if (state.mode === "authenticated" && state.userId === userId) {
        return;
    }
    if (connection?.userId === userId) {
        return connection.promise;
    }

    const guestItems = state.mode === "guest" ? state.items : [];
    const generation = ++sessionGeneration;
    const promise = (async () => {
        useCartStore.setState({ isSyncing: true });

        try {
            const items = await mergeCart(guestItems);
            if (generation === sessionGeneration) {
                useCartStore.setState({
                    items,
                    mode: "authenticated",
                    userId,
                    isSyncing: false,
                });
            }
        } catch (error) {
            if (generation === sessionGeneration) {
                useCartStore.setState({ isSyncing: false });
            }
            throw error;
        } finally {
            if (
                connection?.userId === userId &&
                generation === sessionGeneration
            ) {
                connection = null;
            }
        }
    })();

    connection = { userId, promise };
    return promise;
};

export const disconnectUserCart = (): void => {
    sessionGeneration += 1;
    connection = null;
    syncQueue = Promise.resolve();
    useCartStore.setState({
        items: [],
        mode: "guest",
        userId: null,
        isSyncing: false,
        isDrawerOpen: false,
    });
};
