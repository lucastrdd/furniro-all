import BannerCard from "../../components/BannerCard";
import BenefitsCard from "../../components/BenefitsCard";
import ContactForm from "../../components/ContactForm";
import ContactInfo from "../../components/ContactInfo";
import Container from "../../components/Container";

const Contact = () => {
    return (
        <Container className="bg-white">
            <div className="w-full overflow-x-clip font-poppins leading-normal">
                <BannerCard
                    title="Contact"
                    breadcrumbs={[
                        { label: "Home", href: "/" },
                        { label: "Contact" },
                    ]}
                />

                <main className="w-full">
                    <section
                        aria-labelledby="contact-heading"
                        className="mx-auto w-full max-w-[1080px] px-4 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-20 lg:pb-[63px] lg:pt-[91px]">
                        <div className="mx-auto max-w-[644px] text-center">
                            <h1
                                id="contact-heading"
                                className="text-[28px] font-semibold leading-tight text-black sm:text-[36px]">
                                Get In Touch With Us
                            </h1>
                            <p className="mt-3 text-[15px] leading-[1.5] text-[#9F9F9F] sm:mt-[7px] sm:text-[16px]">
                                For More Information About Our Product &amp;
                                Services. Please Feel Free To Drop Us
                                <br className="hidden sm:block" /> An Email. Our
                                Staff Always Be There To Help You Out. Do Not
                                Hesitate!
                            </p>
                        </div>

                        <div className="mt-12 grid min-w-0 gap-14 sm:mt-16 sm:gap-20 lg:mt-[119px] lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-[79px]">
                            <ContactInfo />
                            <ContactForm />
                        </div>
                    </section>
                </main>

                <BenefitsCard />
            </div>
        </Container>
    );
};

export default Contact;
