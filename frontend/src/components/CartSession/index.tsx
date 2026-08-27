import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../context/authStore";
import { connectUserCart, disconnectUserCart } from "../../context/cartStore";

const CartSession = () => {
    const token = useAuthStore((state) => state.token);
    const userId = useAuthStore((state) => state.user?.id ?? null);
    const previousToken = useRef(token);

    useEffect(() => {
        if (token && userId) {
            void connectUserCart(userId).catch(() => {
                toast.error("We could not sync your cart. Please try again.");
            });
        } else if (previousToken.current) {
            disconnectUserCart();
        }

        previousToken.current = token;
    }, [token, userId]);

    return null;
};

export default CartSession;
