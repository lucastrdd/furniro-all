import { useFormContext } from "react-hook-form";
import type { CheckoutFormData } from "../../pages/Checkout/checkout.schema";
import {
    useZipCodeLookup,
    type ZipLookupStatus,
} from "../../hooks/useZipCodeLookup";
import BillingField from "../BillingField";

const ZipCodeFeedback = ({ status }: { status: ZipLookupStatus }) => {
    if (status === "loading")
        return (
            <p role="status" className="text-sm text-[#666]">
                Looking up ZIP code...
            </p>
        );
    if (status === "found")
        return (
            <p role="status" className="text-sm text-green-700">
                ZIP code found.
            </p>
        );
    if (status === "not-found")
        return (
            <p role="alert" className="text-sm text-red-600">
                ZIP code not found.
            </p>
        );
    if (status === "error")
        return (
            <p role="alert" className="text-sm text-red-600">
                We could not look up this ZIP code. Please try again.
            </p>
        );
    return null;
};

const BillingDetails = () => {
    const { register } = useFormContext<CheckoutFormData>();
    const zipLookupStatus = useZipCodeLookup();

    return (
        <section aria-labelledby="billing-details-title" className="min-w-0">
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
                    feedback={<ZipCodeFeedback status={zipLookupStatus} />}
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
                    <label htmlFor="additionalInformation" className="sr-only">
                        Additional information
                    </label>
                    <textarea
                        id="additionalInformation"
                        placeholder="Additional information"
                        {...register("additionalInformation")}
                        className="min-h-[75px] min-w-0 w-full resize-y rounded-[10px] border border-[#9F9F9F] bg-white px-5 py-6 text-base text-black outline-none transition placeholder:text-[#9F9F9F] focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F]"
                    />
                </div>
            </div>
        </section>
    );
};

export default BillingDetails;
