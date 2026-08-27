import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FormProvider, useForm } from "react-hook-form";
import BenefitsCard from "../../components/BenefitsCard";
import BannerCard from "../../components/BannerCard";
import Container from "../../components/Container";
import { useCartStore } from "../../context/cartStore";
import {
    checkoutDefaultValues,
    checkoutSchema,
    type CheckoutFormData,
} from "./checkout.schema";
import BillingDetails from "../../components/BillingDetails";
import OrderSummary from "../../components/OrderSummary";
import PaymentMethods from "../../components/PaymentMethods";

const Checkout = () => {
    const isCartEmpty = useCartStore((state) => state.items.length === 0);
    const form = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        mode: "onBlur",
        defaultValues: checkoutDefaultValues,
    });

    const handlePlaceOrder = () => {
        if (isCartEmpty) {
            return;
        }

        toast.success("Order placed successfully!");
        form.reset(checkoutDefaultValues);
    };

    return (
        <Container className="bg-white">
            <div className="w-full overflow-x-clip font-poppins leading-normal">
                <BannerCard
                    title="Checkout"
                    breadcrumbs={[
                        { label: "Home", href: "/" },
                        { label: "Checkout" },
                    ]}
                />

                <main className="mx-auto w-full max-w-[1240px] px-4 py-12 sm:px-8 md:py-20 xl:px-0 xl:py-[98px]">
                    <FormProvider {...form}>
                        <form
                            noValidate
                            onSubmit={form.handleSubmit(handlePlaceOrder)}
                            className="min-w-0">
                            <div className="grid gap-16 lg:grid-cols-2 lg:gap-14 xl:grid-cols-[608px_533px] xl:gap-[99px]">
                                <BillingDetails />

                                <aside
                                    aria-labelledby="order-summary-title"
                                    className="min-w-0 lg:pt-8">
                                    <OrderSummary />
                                    <PaymentMethods disabled={isCartEmpty} />
                                </aside>
                            </div>
                        </form>
                    </FormProvider>
                </main>

                <BenefitsCard />
            </div>
        </Container>
    );
};

export default Checkout;
