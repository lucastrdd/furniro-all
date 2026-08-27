import type {
    AuthResponse,
    AuthUser,
    LoginCredentials,
    RegisterData,
    RegisterResponse,
} from "../interface/Auth";
import api from "./api";

export const register = async (
    data: RegisterData,
): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
};

export const login = async (
    credentials: LoginCredentials,
): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
};

export const getAuthenticatedUser = async (): Promise<AuthUser> => {
    const response = await api.get<{ user: AuthUser }>("/auth/me");
    return response.data.user;
};
