import clsx from "clsx";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

type RightMenuProps = {
    className?: string;
};

const RightMenu = ({ className }: RightMenuProps) => {
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const { user, isAuthenticated, clearSession } = useAuth();
    const linkHover = "hover:cursor-pointer hover:scale-110 transition";

    const handleLogout = () => {
        clearSession();
        setIsAccountMenuOpen(false);
        window.location.replace("/");
    };

    return (
        <div className={clsx("flex items-center gap-[33.66px]", className)}>
            <div className="relative flex items-center">
                {isAuthenticated ? (
                    <>
                        <button
                            type="button"
                            aria-label="Open account menu"
                            aria-haspopup="menu"
                            aria-expanded={isAccountMenuOpen}
                            onClick={() =>
                                setIsAccountMenuOpen((current) => !current)
                            }
                            className={clsx(
                                linkHover,
                                "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-over-secundary",
                            )}>
                            <img
                                src="/Icons/alert.svg"
                                alt=""
                                className="max-h-[18.66px]"
                            />
                        </button>

                        {isAccountMenuOpen && (
                            <div
                                role="menu"
                                className="absolute top-9 right-0 z-[60] w-64 rounded-lg border border-black/10 bg-white p-2 shadow-[0_12px_36px_rgba(0,0,0,0.14)]">
                                <div className="border-b border-black/10 px-3 py-2.5">
                                    <p className="font-poppins text-xs text-primary-text-100">
                                        Signed in as
                                    </p>
                                    <p className="mt-1 truncate font-poppins text-sm font-medium text-primary-text">
                                        {user?.email}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={handleLogout}
                                    className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2.5 font-poppins text-sm text-primary-text transition hover:bg-secundary hover:text-over-secundary focus-visible:outline-2 focus-visible:outline-over-secundary">
                                    <LogOut aria-hidden="true" size={17} />
                                    Sign out
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <Link
                        to="/login"
                        aria-label="Sign in"
                        className={linkHover}>
                        <img
                            src="/Icons/alert.svg"
                            alt=""
                            className="max-h-[18.66px]"
                        />
                    </Link>
                )}
            </div>

            <Link
                to="/cart"
                aria-label="View shopping cart"
                className={linkHover}>
                <img src="/Icons/shop.svg" alt="" className="max-h-[22.05px]" />
            </Link>
        </div>
    );
};

export default RightMenu;
