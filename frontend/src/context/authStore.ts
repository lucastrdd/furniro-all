import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse, AuthUser } from "../interface/Auth";

type AuthStore = {
    user: AuthUser | null;
    token: string | null;
    setSession: (session: AuthResponse) => void;
    clearSession: () => void;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            setSession: ({ user, token }) => set({ user, token }),
            clearSession: () => set({ user: null, token: null }),
        }),
        {
            name: "furniro-auth",
            partialize: ({ user, token }) => ({ user, token }),
        },
    ),
);
