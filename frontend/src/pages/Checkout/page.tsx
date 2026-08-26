import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type ReactNode } from "react";
import { useForm, type FieldPath, type UseFormRegister } from "react-hook-form";
import { z } from "zod";
import BenefitsCard from "../../components/BenefitsCard";
import BannerCard from "../../components/BannerCard";
import Container from "../../components/Container";
import {
    lookupAddressByZipCode,
    normalizeZipCode,
    ZipCodeNotFoundError,
} from "../../services/viacep.service";

const checkoutSchema = z.object({
    firstName: z.string().trim().min(1, "Enter your first name."),
    lastName: z.string().trim().min(1, "Enter your last name."),
    companyName: z.string().trim(),
    zipCode: z
        .string()
        .trim()
        .regex(/^\d{5}-?\d{3}$/, "Enter a valid ZIP code."),
    countryRegion: z.string().trim().min(1, "Enter your country or region."),
    streetAddress: z.string().trim().min(1, "Enter your street address."),
    townCity: z.string().trim().min(1, "Enter your town or city."),
    province: z.string().trim().min(1, "Enter your province."),
    addOnAddress: z.string().trim(),
    emailAddress: z
        .string()
        .trim()
        .min(1, "Enter your email address.")
        .email("Enter a valid email address."),
    additionalInformation: z.string().trim(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

type BillingFieldProps = {
    id: FieldPath<CheckoutFormData>;
    label: string;
    type?: "text" | "email";
    autoComplete?: string;
    register: UseFormRegister<CheckoutFormData>;
    error?: string;
    feedback?: ReactNode;
};

const BillingField = ({
    id,
    label,
    type = "text",
    autoComplete,
    register,
    error,
    feedback,
}: BillingFieldProps) => (
    <div className="space-y-5">
        <label htmlFor={id} className="block text-base font-medium text-black">
            {label}
        </label>
        <input
            id={id}
            type={type}
            autoComplete={autoComplete}
            aria-invalid={Boolean(error)}
            aria-describedby={
                error ? `${id}-error` : feedback ? `${id}-feedback` : undefined
            }
            {...register(id)}
            className="h-[75px] w-full rounded-[10px] border border-[#9F9F9F] bg-white px-5 text-base text-black outline-none transition aria-invalid:border-red-600 focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F] aria-invalid:focus:border-red-600 aria-invalid:focus:ring-red-600"
        />
        {error && (
            <p id={`${id}-error`} role="alert" className="text-sm text-red-600">
                {error}
            </p>
        )}
        {!error && feedback && <div id={`${id}-feedback`}>{feedback}</div>}
    </div>
);

type ZipLookupStatus = "idle" | "loading" | "found" | "not-found" | "error";

const Checkout = () => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        mode: "onBlur",
        defaultValues: {
            firstName: "",
            lastName: "",
            companyName: "",
            zipCode: "",
            countryRegion: "",
            streetAddress: "",
            townCity: "",
            province: "",
            addOnAddress: "",
            emailAddress: "",
            additionalInformation: "",
        },
    });
    const zipCode = watch("zipCode");
    const [zipLookupStatus, setZipLookupStatus] =
        useState<ZipLookupStatus>("idle");

    useEffect(() => {
        const normalizedZipCode = normalizeZipCode(zipCode);

        if (normalizedZipCode.length !== 8) {
            setZipLookupStatus("idle");
            return;
        }

        const controller = new AbortController();
        const timeoutId = window.setTimeout(async () => {
            setZipLookupStatus("loading");

            try {
                const address = await lookupAddressByZipCode(
                    zipCode,
                    controller.signal,
                );

                setValue("countryRegion", "Brazil", {
                    shouldDirty: true,
                    shouldValidate: true,
                });
                setValue("streetAddress", address.logradouro, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
                setValue("townCity", address.localidade, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
                setValue("province", address.estado || address.uf, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
                setZipLookupStatus("found");
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                setZipLookupStatus(
                    error instanceof ZipCodeNotFoundError
                        ? "not-found"
                        : "error",
                );
            }
        }, 500);

        return () => {
            window.clearTimeout(timeoutId);
            controller.abort();
        };
    }, [setValue, zipCode]);

    const zipCodeFeedback = (() => {
        if (zipLookupStatus === "loading") {
            return (
                <p role="status" className="text-sm text-[#666]">
                    Looking up ZIP code...
                </p>
            );
        }

        if (zipLookupStatus === "found") {
            return (
                <p role="status" className="text-sm text-green-700">
                    ZIP code found.
                </p>
            );
        }

        if (zipLookupStatus === "not-found") {
            return (
                <p role="alert" className="text-sm text-red-600">
                    ZIP code not found.
                </p>
            );
        }

        if (zipLookupStatus === "error") {
            return (
                <p role="alert" className="text-sm text-red-600">
                    We could not look up this ZIP code. Please try again.
                </p>
            );
        }

        return null;
    })();

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
                    <form noValidate onSubmit={handleSubmit(() => undefined)}>
                        <div className="grid gap-16 lg:grid-cols-2 lg:gap-14 xl:grid-cols-[608px_533px] xl:gap-[99px]">
                            <section aria-labelledby="billing-details-title">
                                <h2
                                    id="billing-details-title"
                                    className="mb-9 text-[32px] font-semibold text-black md:mb-10 md:text-[36px]">
                                    Billing details
                                </h2>

                                <div className="space-y-9">
                                    <div className="grid gap-9 sm:grid-cols-2 sm:gap-[31px]">
                                        <BillingField
                                            id="firstName"
                                            label="First Name"
                                            autoComplete="given-name"
                                            register={register}
                                            error={errors.firstName?.message}
                                        />
                                        <BillingField
                                            id="lastName"
                                            label="Last Name"
                                            autoComplete="family-name"
                                            register={register}
                                            error={errors.lastName?.message}
                                        />
                                    </div>

                                    <BillingField
                                        id="companyName"
                                        label="Company Name (Optional)"
                                        autoComplete="organization"
                                        register={register}
                                    />
                                    <BillingField
                                        id="zipCode"
                                        label="ZIP code"
                                        autoComplete="postal-code"
                                        register={register}
                                        error={errors.zipCode?.message}
                                        feedback={zipCodeFeedback}
                                    />
                                    <BillingField
                                        id="countryRegion"
                                        label="Country / Region"
                                        autoComplete="country-name"
                                        register={register}
                                        error={errors.countryRegion?.message}
                                    />
                                    <BillingField
                                        id="streetAddress"
                                        label="Street address"
                                        autoComplete="street-address"
                                        register={register}
                                        error={errors.streetAddress?.message}
                                    />
                                    <BillingField
                                        id="townCity"
                                        label="Town / City"
                                        autoComplete="address-level2"
                                        register={register}
                                        error={errors.townCity?.message}
                                    />
                                    <BillingField
                                        id="province"
                                        label="Province"
                                        autoComplete="address-level1"
                                        register={register}
                                        error={errors.province?.message}
                                    />
                                    <BillingField
                                        id="addOnAddress"
                                        label="Add-on address"
                                        autoComplete="address-line2"
                                        register={register}
                                    />
                                    <BillingField
                                        id="emailAddress"
                                        label="Email address"
                                        type="email"
                                        autoComplete="email"
                                        register={register}
                                        error={errors.emailAddress?.message}
                                    />

                                    <div>
                                        <label
                                            htmlFor="additionalInformation"
                                            className="sr-only">
                                            Additional information
                                        </label>
                                        <textarea
                                            id="additionalInformation"
                                            placeholder="Additional information"
                                            {...register(
                                                "additionalInformation",
                                            )}
                                            className="min-h-[75px] w-full resize-y rounded-[10px] border border-[#9F9F9F] bg-white px-5 py-6 text-base text-black outline-none transition placeholder:text-[#9F9F9F] focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F]"
                                        />
                                    </div>
                                </div>
                            </section>

                            <aside
                                aria-labelledby="order-summary-title"
                                className="lg:pt-8">
                                <div className="border-b border-[#D9D9D9] pb-8">
                                    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-5">
                                        <h2
                                            id="order-summary-title"
                                            className="text-2xl font-medium text-black">
                                            Product
                                        </h2>
                                        <p className="text-right text-2xl font-medium text-black">
                                            Subtotal
                                        </p>

                                        <p className="min-w-0 text-base text-[#9F9F9F]">
                                            Asgaard sofa
                                            <span className="ml-3 text-xs font-medium text-black">
                                                X 1
                                            </span>
                                        </p>
                                        <p className="whitespace-nowrap text-right text-base font-light text-black">
                                            Rs. 250,000.00
                                        </p>

                                        <p className="text-base text-black">
                                            Subtotal
                                        </p>
                                        <p className="whitespace-nowrap text-right text-base font-light text-black">
                                            Rs. 250,000.00
                                        </p>

                                        <p className="self-center text-base text-black">
                                            Total
                                        </p>
                                        <p className="whitespace-nowrap text-right text-2xl font-bold text-[#B88E2F]">
                                            Rs. 250,000.00
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <div className="flex items-center gap-4 text-base text-black">
                                        <span
                                            aria-hidden="true"
                                            className="h-[14px] w-[14px] shrink-0 rounded-full bg-black"
                                        />
                                        <span>Direct Bank Transfer</span>
                                    </div>
                                    <p className="mt-3 text-justify text-base font-light text-[#9F9F9F]">
                                        Make your payment directly into our bank
                                        account. Please use your Order ID as the
                                        payment reference. Your order will not
                                        be shipped until the funds have cleared
                                        in our account.
                                    </p>

                                    <fieldset className="mt-6 space-y-4 text-base text-[#9F9F9F]">
                                        <legend className="sr-only">
                                            Payment method
                                        </legend>
                                        <label className="flex cursor-pointer items-center gap-4">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="bank-transfer"
                                                className="h-[14px] w-[14px] accent-black"
                                            />
                                            Direct Bank Transfer
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-4">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cash-on-delivery"
                                                className="h-[14px] w-[14px] accent-black"
                                            />
                                            Cash On Delivery
                                        </label>
                                    </fieldset>

                                    <p className="mt-7 text-justify text-base font-light text-black">
                                        Your personal data will be used to
                                        support your experience throughout this
                                        website, to manage access to your
                                        account, and for other purposes
                                        described in our{" "}
                                        <strong className="font-semibold">
                                            privacy policy.
                                        </strong>
                                    </p>

                                    <button
                                        type="submit"
                                        className="mx-auto mt-10 flex h-16 w-full max-w-[318px] items-center justify-center rounded-[15px] border border-black bg-white text-xl text-black transition hover:bg-[#F9F1E7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                                        Place order
                                    </button>
                                </div>
                            </aside>
                        </div>
                    </form>
                </main>

                <BenefitsCard />
            </div>
        </Container>
    );
};

export default Checkout;
