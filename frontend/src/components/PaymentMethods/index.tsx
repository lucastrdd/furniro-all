import clsx from "clsx";
import { useFormContext, useWatch } from "react-hook-form";
import type { CheckoutFormData } from "../../pages/Checkout/checkout.schema";

type PaymentMethodsProps = {
    disabled: boolean;
};

const PaymentMethods = ({ disabled }: PaymentMethodsProps) => {
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext<CheckoutFormData>();
    const paymentMethod = useWatch({ control, name: "paymentMethod" });

    return (
        <div className="pt-6">
            <fieldset
                aria-invalid={Boolean(errors.paymentMethod)}
                aria-describedby={
                    errors.paymentMethod ? "paymentMethod-error" : undefined
                }
                className="space-y-4 text-base text-[#9F9F9F]">
                <legend className="sr-only">Payment method</legend>

                <div>
                    <label
                        className={clsx(
                            "flex cursor-pointer items-center gap-4",
                            paymentMethod === "bank-transfer" && "text-black",
                        )}>
                        <input
                            type="radio"
                            value="bank-transfer"
                            {...register("paymentMethod")}
                            className="h-[14px] w-[14px] accent-black"
                        />
                        Direct Bank Transfer
                    </label>

                    {paymentMethod === "bank-transfer" && (
                        <p className="mt-3 text-justify text-base font-light text-[#9F9F9F]">
                            Make your payment directly into our bank account.
                            Please use your Order ID as the payment reference.
                            Your order will not be shipped until the funds have
                            cleared in our account.
                        </p>
                    )}
                </div>

                <label
                    className={clsx(
                        "flex cursor-pointer items-center gap-4",
                        paymentMethod === "cash-on-delivery" && "text-black",
                    )}>
                    <input
                        type="radio"
                        value="cash-on-delivery"
                        {...register("paymentMethod")}
                        className="h-[14px] w-[14px] accent-black"
                    />
                    Cash On Delivery
                </label>

                {errors.paymentMethod && (
                    <p
                        id="paymentMethod-error"
                        role="alert"
                        className="text-sm text-red-600">
                        {errors.paymentMethod.message}
                    </p>
                )}
            </fieldset>

            <p className="mt-7 text-justify text-base font-light text-black">
                Your personal data will be used to support your experience
                throughout this website, to manage access to your account, and
                for other purposes described in our{" "}
                <strong className="font-semibold">privacy policy.</strong>
            </p>

            <button
                type="submit"
                disabled={disabled}
                className={clsx(
                    "mx-auto mt-10 flex h-16 w-full max-w-[318px] items-center justify-center rounded-[15px] border border-black bg-white text-xl text-black transition hover:bg-[#F9F1E7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
                    disabled && "cursor-not-allowed opacity-50 hover:bg-white",
                )}>
                Place order
            </button>
        </div>
    );
};

export default PaymentMethods;
