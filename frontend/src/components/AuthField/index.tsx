import { Eye, EyeOff } from "lucide-react";
import { useState, type ChangeEventHandler } from "react";

type AuthFieldProps = {
    id: string;
    label: string;
    type?: "email" | "password" | "text";
    value: string;
    placeholder: string;
    autoComplete: string;
    error?: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
};

const AuthField = ({
    id,
    label,
    type = "text",
    value,
    placeholder,
    autoComplete,
    error,
    onChange,
}: AuthFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;
    const errorId = `${id}-error`;

    return (
        <div>
            <label
                htmlFor={id}
                className="font-poppins text-sm font-medium text-primary-text">
                {label}
            </label>
            <div className="relative mt-2">
                <input
                    id={id}
                    name={id}
                    type={inputType}
                    value={value}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    onChange={onChange}
                    className="h-13 w-full rounded-lg border border-[#d7d7d7] bg-white px-4 pr-12 font-poppins text-sm text-primary-text outline-none transition placeholder:text-[#a8a8a8] focus:border-over-secundary focus:ring-3 focus:ring-over-secundary/15 aria-invalid:border-red-500 aria-invalid:focus:ring-red-500/15"
                />
                {isPassword && (
                    <button
                        type="button"
                        aria-label={
                            showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-primary-text-100 transition hover:text-primary-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-over-secundary">
                        {showPassword ? (
                            <EyeOff size={19} />
                        ) : (
                            <Eye size={19} />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="mt-1.5 font-poppins text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default AuthField;
