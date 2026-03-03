"use client";

import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import { useTranslations } from "next-intl";
import { BsCheck2Square, BsCpu, BsDiagram3, BsHeart } from "react-icons/bs";

const icons = {
    0: BsCheck2Square,
    1: BsCpu,
    2: BsDiagram3,
    3: BsHeart
};

export default function WhyWorkWithMe() {
    const t = useTranslations("ServicesPage.whyMe");

    return (
        <section className="py-24 bg-neutral-900 border-t border-neutral-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <AnimatedWrapper>
                    <div className="flex flex-col md:flex-row gap-16 items-start">
                        {/* Title & Headline */}
                        <div className="w-full md:w-1/3 sticky top-32">
                            <span className="text-main font-mono text-sm tracking-widest uppercase mb-4 block">
                                {t("badge")}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                {t("title")}
                            </h2>
                            <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                                {t("subtitle")}
                            </p>
                            <div className="h-1 w-20 bg-gradient-to-r from-main to-transparent rounded-full"></div>
                        </div>

                        {/* Points Grid */}
                        <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[0, 1, 2, 3].map((index) => {
                                const Icon = icons[index];
                                return (
                                    <AnimatedWrapper key={index} delay={index * 0.15}>
                                        <div className="p-8 rounded-3xl bg-neutral-800/40 border border-neutral-700/50 hover:bg-neutral-800 hover:border-main/40 transition-all duration-300 group h-full">
                                            <div className="bg-neutral-900 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-neutral-800 group-hover:border-main/30">
                                                <Icon className="text-2xl text-neutral-400 group-hover:text-main transition-colors" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-main transition-colors">
                                                {t(`points.${index}.title`)}
                                            </h3>
                                            <p className="text-neutral-400 leading-relaxed text-sm">
                                                {t(`points.${index}.description`)}
                                            </p>
                                        </div>
                                    </AnimatedWrapper>
                                );
                            })}
                        </div>
                    </div>
                </AnimatedWrapper>
            </div>
        </section>
    );
}
