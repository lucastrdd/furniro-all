import { FaClock, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const contactItems = [
    {
        icon: FaMapMarkerAlt,
        title: "Address",
        content: (
            <address className="not-italic">
                236 5th SE Avenue, New
                <br />
                York NY10000, United
                <br />
                States
            </address>
        ),
    },
    {
        icon: FaPhoneAlt,
        title: "Phone",
        content: (
            <p>
                Mobile: +(84) 546-6789
                <br />
                Hotline: +(84) 456-6789
            </p>
        ),
    },
    {
        icon: FaClock,
        title: "Working Time",
        content: (
            <p>
                Monday-Friday: 9:00 - 22:00
                <br />
                Saturday-Sunday: 9:00 - 21:00
            </p>
        ),
    },
];

const ContactInfo = () => {
    return (
        <div className="grid min-w-0 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:flex lg:flex-col lg:gap-[42px] lg:pl-12 lg:pt-[6px]">
            {contactItems.map(({ icon: Icon, title, content }) => (
                <article
                    key={title}
                    className="grid min-w-0 grid-cols-[26px_minmax(0,1fr)] gap-x-5 sm:grid-cols-[30px_minmax(0,1fr)] sm:gap-x-[27px]">
                    <Icon
                        aria-hidden="true"
                        className="mt-1 h-[21px] w-[21px] text-black sm:h-[23px] sm:w-[23px]"
                    />
                    <div className="min-w-0">
                        <h3 className="text-[21px] font-medium leading-[1.5] text-black sm:text-[24px]">
                            {title}
                        </h3>
                        <div className="max-w-[220px] text-[15px] leading-[1.5] text-black sm:text-[16px]">
                            {content}
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
};

export default ContactInfo;
