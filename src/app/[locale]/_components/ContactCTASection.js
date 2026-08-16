"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import AnimatedWrapper from "./AnimatedWrapper";

export default function ContactCTASection() {
    const t = useTranslations("HomePage");
    const locale = useLocale();
    const isArabic = locale === "ar";
    const ArrowIcon = isArabic ? BsArrowLeft : BsArrowRight;

    return (
        <section className="w-full py-20 px-6 relative overflow-hidden">
            <div className="flex flex-col items-center justify-center max-w-4xl mx-auto space-y-8 text-center bg-gradient-to-b from-transparent to-neutral-900/50 p-12 rounded-3xl border border-white/5 backdrop-blur-sm shadow-2xl">
                <AnimatedWrapper delay={0.2} className="relative z-10 w-full">
                    <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6 py-2 leading-tight">
                        {t("finalCtaTitle")}
                    </h2>
                    <Link
                        href={`/${locale}/services`}
                        className="inline-flex items-center gap-3 px-10 py-5 bg-main text-black font-bold text-xl rounded-full hover:scale-105 hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(215,177,128,0.3)] mt-8 group"
                    >
                        <span>{t("finalCtaButton")}</span>
                        <ArrowIcon className="text-2xl transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    </Link>
                </AnimatedWrapper>

                {/* Background glow effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-main/5 blur-[100px] -z-10 rounded-full pointer-events-none" />
            </div>
        </section>
    );
}
