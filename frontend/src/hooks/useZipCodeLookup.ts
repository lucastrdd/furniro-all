import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
    lookupAddressByZipCode,
    normalizeZipCode,
    ZipCodeNotFoundError,
} from "../services/viacep.service";
import type { CheckoutFormData } from "../pages/Checkout/checkout.schema";

export type ZipLookupStatus =
    | "idle"
    | "loading"
    | "found"
    | "not-found"
    | "error";

type ZipLookupState = {
    zipCode: string;
    status: ZipLookupStatus;
};

export const useZipCodeLookup = (): ZipLookupStatus => {
    const { control, setValue } = useFormContext<CheckoutFormData>();
    const zipCode = useWatch({ control, name: "zipCode" });
    const normalizedZipCode = normalizeZipCode(zipCode);
    const [lookup, setLookup] = useState<ZipLookupState>({
        zipCode: "",
        status: "idle",
    });
    const status =
        normalizedZipCode.length === 8 && lookup.zipCode === normalizedZipCode
            ? lookup.status
            : "idle";

    useEffect(() => {
        if (normalizedZipCode.length !== 8) return;

        const controller = new AbortController();
        const timeoutId = window.setTimeout(async () => {
            setLookup({ zipCode: normalizedZipCode, status: "loading" });

            try {
                const address = await lookupAddressByZipCode(
                    normalizedZipCode,
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
                setLookup({ zipCode: normalizedZipCode, status: "found" });
            } catch (error) {
                if (controller.signal.aborted) return;

                setLookup({
                    zipCode: normalizedZipCode,
                    status:
                        error instanceof ZipCodeNotFoundError
                            ? "not-found"
                            : "error",
                });
            }
        }, 500);

        return () => {
            window.clearTimeout(timeoutId);
            controller.abort();
        };
    }, [normalizedZipCode, setValue]);

    return status;
};
