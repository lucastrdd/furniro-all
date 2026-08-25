import axios from "axios";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import AuthField from "../../components/AuthField";
import AuthLayout from "../../components/AuthLayout";
import { register } from "../../services/auth.service";

type RegisterForm = {
    email: string;
    password: string;
    confirmPassword: string;
};

type RegisterErrors = Partial<Record<keyof RegisterForm, string>>;

const initialForm: RegisterForm = {
    email: "",
    password: "",
    confirmPassword: "",
};

const validate = ({
    email,
    password,
    confirmPassword,
}: RegisterForm): RegisterErrors => {
    const errors: RegisterErrors = {};

    if (!email.trim()) {
        errors.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Enter a valid email address.";
    }

    if (!password) {
        errors.password = "Create a password.";
    } else if (password.length < 8) {
        errors.password = "Use at least 8 characters.";
    } else if (new TextEncoder().encode(password).length > 72) {
        errors.password = "Use a password containing at most 72 bytes.";
    }

    if (!confirmPassword) {
        errors.confirmPassword = "Confirm your password.";
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
};

const Register = () => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState<RegisterErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const updateField = (field: keyof RegisterForm, value: string) => {
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
            await register({
                email: form.email.trim(),
                password: form.password,
                confirmPassword: form.confirmPassword,
            });
            setIsComplete(true);
            toast.success("Account created successfully.");
        } catch (error) {
            const message = axios.isAxiosError<{ error?: string }>(error)
                ? error.response?.data.error
                : undefined;

            setServerError(
                message ??
                    "We could not create your account. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isComplete) {
        return (
            <AuthLayout
                title="Account created"
                description="Your Furniro account is ready. You can return home and continue exploring.">
                <div className="rounded-xl border border-green-200 bg-green-50 p-6">
                    <CheckCircle2 className="text-green-700" size={32} />
                    <p className="mt-4 font-poppins text-sm leading-6 text-green-900">
                        Your account was created with{" "}
                        <strong>{form.email.trim().toLowerCase()}</strong>.
                    </p>
                </div>
                <Link
                    to="/"
                    className="mt-6 flex h-13 w-full items-center justify-center rounded-lg bg-primary-text font-poppins text-sm font-semibold text-white transition hover:bg-over-secundary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-over-secundary">
                    Return to home
                </Link>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Create your account"
            description="Save your details and enjoy a smoother Furniro shopping experience.">
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
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    error={errors.password}
                    onChange={(event) =>
                        updateField("password", event.target.value)
                    }
                />
                <AuthField
                    id="confirmPassword"
                    label="Confirm password"
                    type="password"
                    value={form.confirmPassword}
                    placeholder="Enter your password again"
                    autoComplete="new-password"
                    error={errors.confirmPassword}
                    onChange={(event) =>
                        updateField("confirmPassword", event.target.value)
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
                    {isSubmitting ? "Creating account..." : "Create account"}
                </button>
            </form>

            <p className="mt-6 text-center font-poppins text-sm text-primary-text-100">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="font-semibold text-primary-text underline-offset-4 hover:underline">
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    );
};

export default Register;
