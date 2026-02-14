"use client";

import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { BsArrowRight, BsEnvelope } from "react-icons/bs";

export default function FinalCTA() {
    const t = useTranslations("ServicesPage.finalCta");

    return (
        <section className="py-32 bg-neutral-900 border-t border-neutral-800 relative overflow-hidden text-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-main/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-6">
                <AnimatedWrapper>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 leading-tight">
                        {t("title")}
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="#calendar-section"
                            className="bg-main text-neutral-900 font-bold px-10 py-4 rounded-full hover:scale-105 transition-transform duration-300 shadow-xl shadow-main/20 flex items-center gap-3"
                        >
                            {t("ctaBook")} <BsArrowRight className="text-xl" />
                        </Link>

                        <Link
                            href="#contact"
                            className="bg-neutral-800 text-white font-medium px-10 py-4 rounded-full hover:bg-neutral-700 transition-colors duration-300 border border-neutral-700 flex items-center gap-3"
                        >
                            <BsEnvelope className="text-xl" />
                            {t("ctaContact")}
                        </Link>
                    </div>
                </AnimatedWrapper>
            </div>
        </section>
    );
}
