import { ShoppingBag, X } from "lucide-react";
import { useCartStore } from "../../context/cartStore";
import NumberToStringRS from "../../utils/NumberToStringRS";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const getImageUrl = (image: string) =>
    image.startsWith("http") ? image : `${API_URL}${image}`;

const getItemPrice = (price: number, discountPrice?: number | null) =>
    discountPrice ? price - price * (discountPrice / 100) : price;

const CartDrawer = () => {
    const items = useCartStore((state) => state.items);
    const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);
    const closeDrawer = useCartStore((state) => state.closeDrawer);
    const removeItem = useCartStore((state) => state.removeItem);

    const subtotal = items.reduce(
        (total, item) =>
            total +
            getItemPrice(item.price, item.discountPrice) * item.quantity,
        0,
    );

    if (!isDrawerOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[70] bg-black/20">
            <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-drawer-title"
                className="absolute top-0 right-0 flex h-[746px] max-h-dvh w-[417px] max-w-full flex-col bg-white font-poppins text-black">
                <header className="px-[30px] pt-[26px]">
                    <div className="flex items-center justify-between">
                        <h2
                            id="cart-drawer-title"
                            className="text-[24px] leading-9 font-semibold">
                            Shopping Cart
                        </h2>

                        <button
                            type="button"
                            aria-label="Close shopping cart"
                            onClick={closeDrawer}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center text-[#9F9F9F] transition hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-over-secundary">
                            <ShoppingBag
                                aria-hidden="true"
                                size={20}
                                strokeWidth={1.5}
                            />
                        </button>
                    </div>

                    <div className="mt-[19px] h-px w-[287px] max-w-full bg-[#D9D9D9]" />
                </header>

                <div
                    className="min-h-0 flex-1 overflow-y-auto px-[30px] py-[27px]"
                    aria-label="Shopping cart items">
                    {items.length === 0 ? (
                        <div className="flex h-full min-h-40 items-center justify-center text-center text-[16px] text-[#9F9F9F]">
                            Your cart is empty.
                        </div>
                    ) : (
                        <ul className="space-y-5">
                            {items.map((item) => {
                                const itemPrice = getItemPrice(
                                    item.price,
                                    item.discountPrice,
                                );

                                return (
                                    <li
                                        key={item.id}
                                        className="relative grid min-h-[105px] grid-cols-[105px_minmax(0,1fr)] items-center gap-8">
                                        <div className="flex h-[105px] w-[105px] items-center justify-center overflow-hidden rounded-[10px] bg-[#F9F1E7]">
                                            <img
                                                src={getImageUrl(item.image)}
                                                alt={item.name}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>

                                        <div className="min-w-0 pr-6">
                                            <p
                                                title={item.name}
                                                className="truncate text-[16px]">
                                                {item.name}
                                            </p>
                                            <p className="mt-2 flex items-center gap-[15px] text-[12px]">
                                                <span>{item.quantity}</span>
                                                <span aria-hidden="true">
                                                    ×
                                                </span>
                                                <span className="text-over-secundary">
                                                    Rs.{" "}
                                                    {NumberToStringRS(
                                                        itemPrice,
                                                    )}
                                                </span>
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            aria-label={`Remove ${item.name} from cart`}
                                            onClick={() => removeItem(item.id)}
                                            className="absolute top-1/2 right-0 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#9F9F9F] text-white transition hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-over-secundary">
                                            <X
                                                aria-hidden="true"
                                                size={13}
                                                strokeWidth={2.5}
                                            />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className="flex min-h-[70px] items-center justify-between px-[30px] text-[16px]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-over-secundary">
                        Rs. {NumberToStringRS(subtotal)}
                    </span>
                </div>

                <footer className="flex min-h-[69px] items-center gap-[14px] border-t border-[#D9D9D9] px-[30px]">
                    <button
                        type="button"
                        disabled
                        className="h-[30px] w-[87px] rounded-[15px] border border-black text-[12px]">
                        Cart
                    </button>
                    <button
                        type="button"
                        disabled
                        className="h-[30px] w-[118px] rounded-[15px] border border-black text-[12px]">
                        Checkout
                    </button>
                </footer>
            </aside>
        </div>
    );
};

export default CartDrawer;
