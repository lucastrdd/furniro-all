import { ShoppingBag } from "lucide-react";
import { useCartStore } from "../../context/cartStore";

const CartDrawer = () => {
    const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);
    const closeDrawer = useCartStore((state) => state.closeDrawer);

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
                    className="min-h-0 flex-1"
                    aria-label="Shopping cart items"
                />

                <div className="flex min-h-[70px] items-center justify-between px-[30px] text-[16px]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-over-secundary">
                        Rs. 0.00
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
