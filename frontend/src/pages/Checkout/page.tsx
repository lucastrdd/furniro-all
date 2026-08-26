import BenefitsCard from "../../components/BenefitsCard";
import BannerCard from "../../components/BannerCard";
import Container from "../../components/Container";

type BillingFieldProps = {
    id: string;
    label: string;
    type?: "text" | "email";
    autoComplete?: string;
};

const BillingField = ({
    id,
    label,
    type = "text",
    autoComplete,
}: BillingFieldProps) => (
    <div className="space-y-5">
        <label htmlFor={id} className="block text-base font-medium text-black">
            {label}
        </label>
        <input
            id={id}
            name={id}
            type={type}
            autoComplete={autoComplete}
            className="h-[75px] w-full rounded-[10px] border border-[#9F9F9F] bg-white px-5 text-base text-black outline-none transition focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F]"
        />
    </div>
);

const Checkout = () => {
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
                    <form noValidate>
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
                                        />
                                        <BillingField
                                            id="lastName"
                                            label="Last Name"
                                            autoComplete="family-name"
                                        />
                                    </div>

                                    <BillingField
                                        id="companyName"
                                        label="Company Name (Optional)"
                                        autoComplete="organization"
                                    />
                                    <BillingField
                                        id="zipCode"
                                        label="ZIP code"
                                        autoComplete="postal-code"
                                    />
                                    <BillingField
                                        id="countryRegion"
                                        label="Country / Region"
                                        autoComplete="country-name"
                                    />
                                    <BillingField
                                        id="streetAddress"
                                        label="Street address"
                                        autoComplete="street-address"
                                    />
                                    <BillingField
                                        id="townCity"
                                        label="Town / City"
                                        autoComplete="address-level2"
                                    />
                                    <BillingField
                                        id="province"
                                        label="Province"
                                        autoComplete="address-level1"
                                    />
                                    <BillingField
                                        id="addOnAddress"
                                        label="Add-on address"
                                        autoComplete="address-line2"
                                    />
                                    <BillingField
                                        id="emailAddress"
                                        label="Email address"
                                        type="email"
                                        autoComplete="email"
                                    />

                                    <div>
                                        <label
                                            htmlFor="additionalInformation"
                                            className="sr-only">
                                            Additional information
                                        </label>
                                        <textarea
                                            id="additionalInformation"
                                            name="additionalInformation"
                                            placeholder="Additional information"
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
                                        type="button"
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
