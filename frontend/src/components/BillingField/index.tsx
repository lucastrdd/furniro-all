import type { ReactNode } from "react";
import { useFormContext, type FieldPath } from "react-hook-form";
import type { CheckoutFormData } from "../../pages/Checkout/checkout.schema";

type BillingFieldProps = {
    id: FieldPath<CheckoutFormData>;
    label: string;
    type?: "text" | "email";
    autoComplete?: string;
    feedback?: ReactNode;
};

const BillingField = ({
    id,
    label,
    type = "text",
    autoComplete,
    feedback,
}: BillingFieldProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext<CheckoutFormData>();
    const fieldError = errors[id]?.message;
    const error = typeof fieldError === "string" ? fieldError : undefined;

    return (
        <div className="space-y-5">
            <label
                htmlFor={id}
                className="block text-base font-medium text-black">
                {label}
            </label>
            <input
                id={id}
                type={type}
                autoComplete={autoComplete}
                aria-invalid={Boolean(error)}
                aria-describedby={
                    error
                        ? `${id}-error`
                        : feedback
                          ? `${id}-feedback`
                          : undefined
                }
                {...register(id)}
                className="h-[75px] min-w-0 w-full rounded-[10px] border border-[#9F9F9F] bg-white px-5 text-base text-black outline-none transition aria-invalid:border-red-600 focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F] aria-invalid:focus:border-red-600 aria-invalid:focus:ring-red-600"
            />
            {error && (
                <p
                    id={`${id}-error`}
                    role="alert"
                    className="text-sm text-red-600">
                    {error}
                </p>
            )}
            {!error && feedback && <div id={`${id}-feedback`}>{feedback}</div>}
        </div>
    );
};

export default BillingField;
