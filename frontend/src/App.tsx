import { Toaster } from "react-hot-toast";
import Container from "./components/Container";
import Header from "./components/Header";
import Home from "./pages/Home/page";
import Footer from "./components/Footer";
import { Route, Routes, useLocation } from "react-router-dom";
import Product from "./pages/Product/page";
import Shop from "./pages/Shop/page";
import Cart from "./pages/Cart/page";
import Register from "./pages/Register/page";
import Login from "./pages/Login/page";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";

const protectedPaths = ["/checkout", "/contact"];

const App = () => {
    const { pathname } = useLocation();
    const isAuthPage = pathname === "/register" || pathname === "/login";
    const isProtectedPage = protectedPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

    const routes = (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop/:category?" element={<Shop />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );

    return (
        <>
            <Toaster />

            {!isAuthPage && (
                <Container className="bg-[#FFF]">
                    <Header />
                </Container>
            )}
            {isProtectedPage ? (
                <ProtectedRoute>{routes}</ProtectedRoute>
            ) : (
                routes
            )}
            {!isAuthPage && (
                <Container className="bg-primary border-t border-t-[rgba(0,0,0,0.17)]">
                    <Footer />
                </Container>
            )}
        </>
    );
};

export default App;
