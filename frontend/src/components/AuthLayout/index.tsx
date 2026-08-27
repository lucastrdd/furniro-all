import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type AuthLayoutProps = {
    title: string;
    description: string;
    children: ReactNode;
};

const AuthLayout = ({ title, description, children }: AuthLayoutProps) => {
    return (
        <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_0.95fr]">
            <section className="relative hidden overflow-hidden bg-[#f4f1eb] lg:block">
                <img
                    src="/Images/Hero.jpg"
                    alt="Furnished living room with a rattan chair and indoor plants"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12 max-w-md text-white xl:bottom-16 xl:left-16">
                    <p className="font-poppins text-sm font-semibold tracking-[0.24em] uppercase">
                        Furniro living
                    </p>
                    <p className="mt-3 font-poppins text-3xl font-semibold leading-tight xl:text-4xl">
                        Spaces designed around the way you live.
                    </p>
                </div>
            </section>

            <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-24">
                <div className="w-full max-w-md">
                    <Link
                        to="/"
                        aria-label="Return to Furniro home"
                        className="inline-flex items-center gap-3">
                        <img
                            src="/Logo/Logo.svg"
                            alt=""
                            className="h-12 w-auto"
                        />
                        <span className="font-montserrat text-2xl font-bold">
                            Furniro
                        </span>
                    </Link>

                    <div className="mt-10">
                        <p className="font-poppins text-sm font-semibold tracking-[0.18em] text-over-secundary uppercase">
                            Welcome
                        </p>
                        <h1 className="mt-2 font-poppins text-4xl font-semibold tracking-tight text-primary-text">
                            {title}
                        </h1>
                        <p className="mt-3 font-poppins text-sm leading-6 text-primary-text-100">
                            {description}
                        </p>
                    </div>

                    <div className="mt-8">{children}</div>
                </div>
            </section>
        </main>
    );
};

export default AuthLayout;
