import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    contactDefaultValues,
    contactSchema,
    type ContactFormData,
} from "../../pages/Contact/contact.schema";

const fieldClassName =
    "h-[75px] w-full rounded-[10px] border border-[#9F9F9F] bg-white px-[29px] text-[16px] text-black outline-none transition placeholder:text-[#9F9F9F] aria-invalid:border-red-600 focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F] aria-invalid:focus:border-red-600 aria-invalid:focus:ring-red-600";

const ContactForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        mode: "onBlur",
        defaultValues: contactDefaultValues,
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
                        className="mb-[22px] block text-[16px] font-medium text-black">
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
