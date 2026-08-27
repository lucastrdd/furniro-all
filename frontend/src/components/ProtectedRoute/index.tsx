import { useEffect, useState, type ReactNode } from "react";
import { createSearchParams, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getAuthenticatedUser } from "../../services/auth.service";
import LoadingSpinner from "../LoadingSpinner";

type ProtectedRouteProps = {
    children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { token, setSession, clearSession } = useAuth();
    const location = useLocation();
    const [validatedToken, setValidatedToken] = useState<string | null>(null);
    const isValidating = Boolean(token && token !== validatedToken);

    useEffect(() => {
        if (!token) {
            return;
        }

        let isActive = true;

        const validateSession = async () => {
            try {
                const user = await getAuthenticatedUser();

                if (isActive) {
                    setSession({ token, user });
                }
            } catch {
                if (isActive) {
                    clearSession();
                }
            } finally {
                if (isActive) {
                    setValidatedToken(token);
                }
            }
        };

        void validateSession();

        return () => {
            isActive = false;
        };
    }, [token, setSession, clearSession]);

    if (!token) {
        const requestedPath = `${location.pathname}${location.search}${location.hash}`;
        const loginSearch = createSearchParams({
            referer: requestedPath,
        }).toString();

        return <Navigate to={`/login?${loginSearch}`} replace />;
    }

    if (isValidating) {
        return (
            <div
                className="flex min-h-[50vh] items-center justify-center"
                role="status"
                aria-label="Validating session">
                <LoadingSpinner />
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
