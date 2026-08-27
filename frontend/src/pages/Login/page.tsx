import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import AuthField from "../../components/AuthField";
import AuthLayout from "../../components/AuthLayout";
import { useAuth } from "../../context/useAuth";
import { login } from "../../services/auth.service";

type LoginForm = {
    email: string;
    password: string;
};

type LoginErrors = Partial<Record<keyof LoginForm, string>>;

const initialForm: LoginForm = {
    email: "",
    password: "",
};

const validate = ({ email, password }: LoginForm): LoginErrors => {
    const errors: LoginErrors = {};

    if (!email.trim()) {
        errors.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Enter a valid email address.";
    }

    if (!password) {
        errors.password = "Enter your password.";
    }

    return errors;
};

const getSafeDestination = (requestedPath: unknown) => {
    if (
        typeof requestedPath === "string" &&
        requestedPath.startsWith("/") &&
        !requestedPath.startsWith("//")
    ) {
        return requestedPath;
    }

    return "/";
};

const Login = () => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState<LoginErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isAuthenticated, setSession } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const requestedPath = searchParams.get("referer");
    const destination = getSafeDestination(requestedPath);

    if (isAuthenticated) {
        return <Navigate to={destination} replace />;
    }

    const updateField = (field: keyof LoginForm, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
        setServerError(null);
    };

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validate(form);
        setErrors(validationErrors);
        setServerError(null);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setIsSubmitting(true);

        try {
            const session = await login({
                email: form.email.trim(),
                password: form.password,
            });

            setSession(session);
            toast.success("Welcome back.");
            navigate(destination, { replace: true });
        } catch (error) {
            const message = axios.isAxiosError<{ error?: string }>(error)
                ? error.response?.data.error
                : undefined;

            setServerError(
                message ?? "We could not sign you in. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            description="Sign in to continue your Furniro shopping experience.">
            <form noValidate onSubmit={handleSubmit} className="space-y-5">
                <AuthField
                    id="email"
                    label="Email address"
                    type="email"
                    value={form.email}
                    placeholder="you@example.com"
                    autoComplete="email"
                    error={errors.email}
                    onChange={(event) =>
                        updateField("email", event.target.value)
                    }
                />

                <AuthField
                    id="password"
                    label="Password"
                    type="password"
                    value={form.password}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    error={errors.password}
                    onChange={(event) =>
                        updateField("password", event.target.value)
                    }
                />

                {serverError && (
                    <p
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-poppins text-sm text-red-700">
                        {serverError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-13 w-full items-center justify-center gap-2 rounded-lg bg-primary-text font-poppins text-sm font-semibold text-white transition hover:bg-over-secundary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-over-secundary disabled:cursor-not-allowed disabled:opacity-60">
                    {isSubmitting && (
                        <LoaderCircle
                            aria-hidden="true"
                            size={18}
                            className="animate-spin"
                        />
                    )}
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <p className="mt-6 text-center font-poppins text-sm text-primary-text-100">
                New to Furniro?{" "}
                <Link
                    to="/register"
                    className="font-semibold text-primary-text underline-offset-4 hover:underline">
                    Create an account
                </Link>
            </p>
        </AuthLayout>
    );
};

export default Login;
