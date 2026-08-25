import clsx from "clsx";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import MobileMenu from "../MobileMenu";
import NavMenu from "../NavMenu";
import RightMenu from "../RigthMenu";

const Header = () => {
    return (
        <>
            <header
                className={clsx(
                    "fixed inset-x-0 top-0 z-50",
                    "flex h-25 w-full items-center justify-center",
                    "bg-primary",
                )}>
                <div
                    className={clsx(
                        "flex max-h-10.25 w-full max-w-360 items-center justify-between px-2",
                        "md:px-4",
                        "lg:px-12.5",
                    )}>
                    <Link to="/" aria-label="Furniro home">
                        <Logo />
                    </Link>

                    <NavMenu className={clsx("hidden", "md:flex")} />
                    <RightMenu className={clsx("hidden", "md:flex")} />
                    <MobileMenu className={clsx("flex", "md:hidden")} />
                </div>
            </header>

            <div className="h-25" aria-hidden="true" />
        </>
    );
};

export default Header;
