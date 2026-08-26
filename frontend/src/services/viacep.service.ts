import axios from "axios";

export type ViaCepAddress = {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    estado: string;
};

type ViaCepResponse = ViaCepAddress & {
    erro?: boolean;
};

export class ZipCodeNotFoundError extends Error {
    constructor() {
        super("ZIP code not found.");
        this.name = "ZipCodeNotFoundError";
    }
}

export const normalizeZipCode = (zipCode: string) => zipCode.replace(/\D/g, "");

export const lookupAddressByZipCode = async (
    zipCode: string,
    signal?: AbortSignal,
): Promise<ViaCepAddress> => {
    const normalizedZipCode = normalizeZipCode(zipCode);
    const response = await axios.get<ViaCepResponse>(
        `https://viacep.com.br/ws/${normalizedZipCode}/json/`,
        { signal },
    );

    if (response.data.erro) {
        throw new ZipCodeNotFoundError();
    }

    return response.data;
};
