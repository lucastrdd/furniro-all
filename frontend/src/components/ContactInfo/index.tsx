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
        <div className="flex flex-col gap-10 sm:gap-[42px] lg:pt-[6px]">
            {contactItems.map(({ icon: Icon, title, content }) => (
                <article
                    key={title}
                    className="grid grid-cols-[30px_minmax(0,1fr)] gap-x-[27px]">
                    <Icon
                        aria-hidden="true"
                        className="mt-1 h-[22px] w-[22px] text-black sm:h-[23px] sm:w-[23px]"
                    />
                    <div>
                        <h3 className="text-[22px] font-medium leading-[1.5] text-black sm:text-[24px]">
                            {title}
                        </h3>
                        <div className="max-w-[220px] text-[16px] leading-[1.5] text-black">
                            {content}
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
};

export default ContactInfo;
