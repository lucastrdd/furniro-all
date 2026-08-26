import { useCart } from "../../context/useCart";

const getItemPrice = (price: number, discountPrice?: number | null) =>
    discountPrice ? price - price * (discountPrice / 100) : price;

const formatRs = (value: number) =>
    new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);

const OrderSummary = () => {
    const { items } = useCart();
    const subtotal = items.reduce(
        (total, item) =>
            total +
            getItemPrice(item.price, item.discountPrice) * item.quantity,
        0,
    );

    return (
        <div className="border-b border-[#D9D9D9] pb-8">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-5 sm:gap-x-6">
                <h2
                    id="order-summary-title"
                    className="text-xl font-medium text-black sm:text-2xl">
                    Product
                </h2>
                <p className="text-right text-xl font-medium text-black sm:text-2xl">
                    Subtotal
                </p>

                {items.length === 0 ? (
                    <p className="col-span-2 text-base text-[#9F9F9F]">
                        Your cart is empty.
                    </p>
                ) : (
                    items.map((item) => {
                        const itemSubtotal =
                            getItemPrice(item.price, item.discountPrice) *
                            item.quantity;

                        return (
                            <div
                                key={item.id}
                                className="col-span-2 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-x-3 sm:gap-x-6">
                                <p className="min-w-0 [overflow-wrap:anywhere] text-base text-[#9F9F9F]">
                                    {item.name}
                                    <span className="ml-3 text-xs font-medium text-black">
                                        X {item.quantity}
                                    </span>
                                </p>
                                <p className="whitespace-nowrap text-right text-sm font-light text-black xxs:text-base">
                                    Rs. {formatRs(itemSubtotal)}
                                </p>
                            </div>
                        );
                    })
                )}

                <p className="text-base text-black">Subtotal</p>
                <p className="whitespace-nowrap text-right text-sm font-light text-black xxs:text-base">
                    Rs. {formatRs(subtotal)}
                </p>
                <p className="self-center text-base text-black">Total</p>
                <p className="whitespace-nowrap text-right text-xl font-bold text-[#B88E2F] sm:text-2xl">
                    Rs. {formatRs(subtotal)}
                </p>
            </div>
        </div>
    );
};

export default OrderSummary;
