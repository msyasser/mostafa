"use client";

import { useTranslations } from "next-intl";
import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";

export default function CaseStudiesHero() {
    const t = useTranslations("CaseStudiesPage");

    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-main/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <AnimatedWrapper>
                    <span className="text-main font-mono text-sm tracking-widest uppercase mb-6 block">
                        {t("portfolioBadge")}
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                        {t("selected")} <span className="text-main">{t("works")}</span>
                    </h1>
                    <p className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                        {t("heroDesc")}
                    </p>
                </AnimatedWrapper>
            </div>
        </section>
    );
}
