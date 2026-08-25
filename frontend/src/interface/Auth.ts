export type AuthUser = {
    id: string;
    email: string;
    createdAt?: string;
};

export type LoginCredentials = {
    email: string;
    password: string;
};

export type RegisterData = LoginCredentials & {
    confirmPassword: string;
};

export type AuthResponse = {
    token: string;
    user: AuthUser;
};

export type RegisterResponse = {
    user: AuthUser;
};
