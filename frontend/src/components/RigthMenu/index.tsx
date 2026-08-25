import clsx from "clsx";
import { Link } from "react-router-dom";

type RightMenuProps = {
    className?: string;
};
const RightMenu = ({ className }: RightMenuProps) => {
    const LinkHover: string = "hover:cursor-pointer hover:scale-110 transition";
    return (
        <div className={clsx("flex gap-[33.66px]", className)}>
            <Link to="/login" aria-label="Sign in" className={clsx(LinkHover)}>
                <img
                    src="/Icons/alert.svg"
                    alt=""
                    className={clsx("max-h-[18.66px]")}
                />
            </Link>
            <Link
                to="/cart"
                aria-label="View shopping cart"
                className={clsx(LinkHover)}>
                <img src="/Icons/shop.svg" alt="" className="max-h-[22.05px]" />
            </Link>
        </div>
    );
};
export default RightMenu;
