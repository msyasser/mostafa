"use client";

import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { MdEmail, MdSupportAgent, MdDesignServices } from "react-icons/md";
import FilloutSlider from "@/src/app/[locale]/_components/FilloutSliderEmbed";

export default function ContactOptions() {
    const t = useTranslations("ContactPage.options");

    const options = [
        {
            key: "email",
            icon: MdEmail,
            href: "mailto:contact@mostafayasser.com",
            actionType: "link"
        },
        {
            key: "custom",
            icon: MdDesignServices,
            // href: "#", // Fillout trigger
            actionType: "fillout"
        },
        {
            key: "support",
            icon: MdSupportAgent,
            href: "mailto:support@mostafayasser.com", // Assuming support email or form
            actionType: "link"
        }
    ];

    return (
        <section className="py-24 bg-neutral-950 px-6 border-t border-neutral-900">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {options.map((option, index) => (
                    <AnimatedWrapper key={option.key} delay={index * 0.1}>
                        <div className="group h-full p-8 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-main/50 transition-all duration-500 hover:shadow-2xl hover:shadow-main/10 flex flex-col items-center text-center">

                            {/* Icon Circle */}
                            <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-6 group-hover:bg-main group-hover:text-black text-main transition-colors duration-500">
                                <option.icon className="text-3xl" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-main transition-colors">
                                {t(`${option.key}.title`)}
                            </h3>

                            <p className="text-neutral-400 mb-8 flex-grow leading-relaxed">
                                {t(`${option.key}.description`)}
                            </p>

                            {option.actionType === "link" ? (
                                <Link
                                    href={option.href}
                                    className="inline-block w-full py-3 px-6 rounded-full border border-neutral-700 hover:bg-main hover:text-black hover:border-main transition-all duration-300 font-medium tracking-wide uppercase text-sm text-neutral-300"
                                >
                                    {t(`${option.key}.button`)}
                                </Link>
                            ) : (
                                <FilloutSlider className="w-full inline-block py-3 px-6 rounded-full border border-neutral-700 hover:bg-main hover:text-black hover:border-main transition-all duration-300 font-medium tracking-wide uppercase text-sm text-neutral-300 cursor-pointer">
                                    {t(`${option.key}.button`)}
                                </FilloutSlider>
                            )}
                        </div>
                    </AnimatedWrapper>
                ))}
            </div>
        </section >
    );
}
