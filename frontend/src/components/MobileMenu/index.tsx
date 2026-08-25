import clsx from "clsx";
import { useState, type MouseEvent } from "react";
import { LuMenu } from "react-icons/lu";
import NavMenu from "../NavMenu";
import RightMenu from "../RigthMenu";

type MobileMenuProps = {
    className?: string;
};

const MobileMenu = ({ className }: MobileMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleNavigation = (event: MouseEvent<HTMLElement>) => {
        const target = event.target as HTMLElement;

        if (target.closest("a[href]")) {
            setIsOpen(false);
        }
    };

    return (
        <div className={clsx("relative", className)}>
            <button
                type="button"
                aria-label={
                    isOpen ? "Close navigation menu" : "Open navigation menu"
                }
                aria-expanded={isOpen}
                onClick={() => setIsOpen((current) => !current)}
                className="transition-all hover:scale-110 hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-over-secundary">
                <LuMenu aria-hidden="true" size={32} />
            </button>

            <div onClick={handleNavigation}>
                <NavMenu
                    className={clsx(
                        "h-[calc(100vh-100px)] max-w-[50vw] min-w-62.5",
                        "absolute top-16.25 -right-2",
                        "flex-col",
                        "justify-center items-center gap-5",
                        "bg-primary",
                        {
                            flex: isOpen,
                            hidden: !isOpen,
                        },
                    )}>
                    <RightMenu className="mt-6" />
                </NavMenu>
            </div>
        </div>
    );
};

export default MobileMenu;
