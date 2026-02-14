"use client";

import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import { useTranslations } from "next-intl";

export default function ContactHero() {
    const t = useTranslations("ContactPage.hero");

    return (
        <section className="relative min-h-[50vh] flex flex-col justify-center items-center text-center px-6 py-32 overflow-hidden bg-neutral-950">
            {/* Background Blueprint Grid */}
            <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-50"></div>

            {/* Glow Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-main/10 rounded-full blur-[100px] pointer-events-none"></div>

            <AnimatedWrapper>
                <div className="relative z-10 flex flex-col items-center">
                    <span className="px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/80 text-main text-sm font-mono tracking-widest uppercase mb-8 backdrop-blur-md">
                        {t("badge")}
                    </span>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-6">
                        {t("title")}
                    </h1>

                    <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed font-light">
                        {t("subtitle")}
                    </p>
                </div>
            </AnimatedWrapper>
        </section>
    );
}
