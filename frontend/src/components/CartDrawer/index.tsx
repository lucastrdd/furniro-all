import { useEffect, useRef } from "react";
import { ShoppingBag, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../context/cartStore";
import NumberToStringRS from "../../utils/NumberToStringRS";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const getImageUrl = (image: string) =>
    image.startsWith("http") ? image : `${API_URL}${image}`;

const getItemPrice = (price: number, discountPrice?: number | null) =>
    discountPrice ? price - price * (discountPrice / 100) : price;

const CartDrawer = () => {
    const navigate = useNavigate();
    const closeButtonRef = useRef<HTMLButtonElement>(null);
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

    useEffect(() => {
        if (!isDrawerOpen) {
            return;
        }

        const previouslyFocusedElement = document.activeElement;
        const previousBodyOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeDrawer();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousBodyOverflow;

            if (
                previouslyFocusedElement instanceof HTMLElement &&
                previouslyFocusedElement.isConnected
            ) {
                previouslyFocusedElement.focus();
            }
        };
    }, [isDrawerOpen, closeDrawer]);

    const handleNavigation = (path: "/cart" | "/checkout") => {
        navigate(path);
        closeDrawer();
    };

    if (!isDrawerOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[70] bg-black/20" onClick={closeDrawer}>
            <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-drawer-title"
                onClick={(event) => event.stopPropagation()}
                className="absolute top-0 right-0 flex h-dvh w-full flex-col bg-white font-poppins text-black xxs:h-[746px] xxs:max-h-dvh xxs:w-[417px] xxs:max-w-full">
                <header className="px-5 pt-[26px] xxs:px-[30px]">
                    <div className="flex items-center justify-between">
                        <h2
                            id="cart-drawer-title"
                            className="text-[24px] leading-9 font-semibold">
                            Shopping Cart
                        </h2>

                        <button
                            ref={closeButtonRef}
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
                    className="min-h-0 flex-1 overscroll-contain overflow-y-auto px-5 py-[27px] xxs:px-[30px]"
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
                                        className="relative grid min-h-[88px] grid-cols-[88px_minmax(0,1fr)] items-center gap-4 xxs:min-h-[105px] xxs:grid-cols-[105px_minmax(0,1fr)] xxs:gap-8">
                                        <div className="flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-[10px] bg-[#F9F1E7] xxs:h-[105px] xxs:w-[105px]">
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
                                            <p className="mt-2 flex items-center gap-2 whitespace-nowrap text-[12px] xxs:gap-[15px]">
                                                <span>{item.quantity}</span>
                                                <span aria-hidden="true">
                                                    ×
                                                </span>
                                                <span className="truncate text-over-secundary">
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

                <div className="flex min-h-[70px] items-center justify-between gap-4 px-5 text-[16px] xxs:px-[30px]">
                    <span>Subtotal</span>
                    <span className="min-w-0 truncate font-semibold text-over-secundary">
                        Rs. {NumberToStringRS(subtotal)}
                    </span>
                </div>

                <footer className="flex min-h-[69px] items-center gap-[14px] border-t border-[#D9D9D9] px-5 xxs:px-[30px]">
                    <button
                        type="button"
                        onClick={() => handleNavigation("/cart")}
                        className="h-[30px] w-[87px] cursor-pointer rounded-[15px] border border-black text-[12px] transition hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-over-secundary">
                        Cart
                    </button>
                    <button
                        type="button"
                        onClick={() => handleNavigation("/checkout")}
                        className="h-[30px] w-[118px] cursor-pointer rounded-[15px] border border-black text-[12px] transition hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-over-secundary">
                        Checkout
                    </button>
                </footer>
            </aside>
        </div>
    );
};

export default CartDrawer;
