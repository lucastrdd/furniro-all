import { useAuthStore } from "./authStore";

export const useAuth = () => {
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    const setSession = useAuthStore((state) => state.setSession);
    const clearSession = useAuthStore((state) => state.clearSession);

    return {
        user,
        token,
        isAuthenticated: Boolean(token),
        setSession,
        clearSession,
    };
};
