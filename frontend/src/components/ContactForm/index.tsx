import { useForm } from "react-hook-form";

type ContactFormData = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

const fieldClassName =
    "h-[75px] w-full rounded-[10px] border border-[#9F9F9F] bg-white px-[29px] text-[16px] text-black outline-none transition placeholder:text-[#9F9F9F] focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F]";

const ContactForm = () => {
    const { register, handleSubmit } = useForm<ContactFormData>({
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    return (
        <form
            noValidate
            aria-label="Contact form"
            onSubmit={handleSubmit(() => undefined)}
            className="w-full max-w-[531px]">
            <div className="space-y-9">
                <div>
                    <label
                        htmlFor="name"
                        className="mb-[22px] block text-[16px] font-medium text-black">
                        Your name
                    </label>
                    <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Abc"
                        {...register("name")}
                        className={fieldClassName}
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="mb-[22px] block text-[16px] font-medium text-black">
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="Abc@def.com"
                        {...register("email")}
                        className={fieldClassName}
                    />
                </div>

                <div>
                    <label
                        htmlFor="subject"
                        className="mb-[22px] block text-[16px] font-medium text-black">
                        Subject
                    </label>
                    <input
                        id="subject"
                        type="text"
                        placeholder="This is an optional"
                        {...register("subject")}
                        className={fieldClassName}
                    />
                </div>

                <div>
                    <label
                        htmlFor="message"
                        className="mb-[22px] block text-[16px] font-medium text-black">
                        Message
                    </label>
                    <textarea
                        id="message"
                        placeholder="Hi! I'd like to ask about"
                        {...register("message")}
                        className="min-h-[120px] w-full resize-y rounded-[10px] border border-[#9F9F9F] bg-white px-[29px] py-[26px] text-[16px] text-black outline-none transition placeholder:text-[#9F9F9F] focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F]"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="mt-[45px] inline-flex h-[55px] w-full max-w-[237px] cursor-pointer items-center justify-center rounded-[5px] border border-[#B88E2F] bg-[#B88E2F] text-[16px] text-white transition hover:bg-[#A47E2A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88E2F]">
                Submit
            </button>
        </form>
    );
};

export default ContactForm;
