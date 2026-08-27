import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
    contactDefaultValues,
    contactSchema,
    type ContactFormData,
} from "../../pages/Contact/contact.schema";

const fieldClassName =
    "h-16 w-full min-w-0 rounded-[10px] border border-[#9F9F9F] bg-white px-5 text-[16px] text-black outline-none transition placeholder:text-[#9F9F9F] aria-invalid:border-red-600 focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F] aria-invalid:focus:border-red-600 aria-invalid:focus:ring-red-600 sm:h-[75px] sm:px-[29px]";

const ContactForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        mode: "onBlur",
        defaultValues: contactDefaultValues,
    });

    const handleContactSubmit = () => {
        toast.success("Message sent successfully!");
        reset(contactDefaultValues);
    };

    return (
        <form
            noValidate
            aria-label="Contact form"
            onSubmit={handleSubmit(handleContactSubmit)}
            className="w-full min-w-0 max-w-[531px] lg:justify-self-end">
            <div className="space-y-8 sm:space-y-9">
                <div>
                    <label
                        htmlFor="name"
                        className="mb-3.5 block text-[16px] font-medium text-black sm:mb-[22px]">
                        Your name
                    </label>
                    <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Abc"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={
                            errors.name ? "name-error" : undefined
                        }
                        {...register("name")}
                        className={fieldClassName}
                    />
                    {errors.name && (
                        <p
                            id="name-error"
                            role="alert"
                            className="mt-2 text-sm text-red-600">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="mb-3.5 block text-[16px] font-medium text-black sm:mb-[22px]">
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="Abc@def.com"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                            errors.email ? "email-error" : undefined
                        }
                        {...register("email")}
                        className={fieldClassName}
                    />
                    {errors.email && (
                        <p
                            id="email-error"
                            role="alert"
                            className="mt-2 text-sm text-red-600">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="subject"
                        className="mb-3.5 block text-[16px] font-medium text-black sm:mb-[22px]">
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
                        className="mb-3.5 block text-[16px] font-medium text-black sm:mb-[22px]">
                        Message
                    </label>
                    <textarea
                        id="message"
                        placeholder="Hi! I'd like to ask about"
                        {...register("message")}
                        className="min-h-[110px] w-full min-w-0 resize-y rounded-[10px] border border-[#9F9F9F] bg-white px-5 py-5 text-[16px] text-black outline-none transition placeholder:text-[#9F9F9F] focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F] sm:min-h-[120px] sm:px-[29px] sm:py-[26px]"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="mt-9 inline-flex h-[55px] w-full cursor-pointer items-center justify-center rounded-[5px] border border-[#B88E2F] bg-[#B88E2F] text-[16px] text-white transition hover:bg-[#A47E2A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88E2F] sm:mt-[45px] sm:max-w-[237px]">
                Submit
            </button>
        </form>
    );
};

export default ContactForm;
