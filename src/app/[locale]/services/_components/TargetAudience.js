"use client";

import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import { useTranslations } from "next-intl";
import { BsCheckCircleFill } from "react-icons/bs";

export default function TargetAudience() {
    const t = useTranslations("ServicesPage.targetAudience");

    return (
        <section className="py-24 bg-neutral-900 border-t border-neutral-800">
            <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
                <AnimatedWrapper>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-12">
                        {t("title")}
                    </h2>
                </AnimatedWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {[0, 1, 2, 3].map((index) => (
                        <AnimatedWrapper key={index} delay={index * 0.1}>
                            <div className="flex items-start gap-4 p-6 rounded-2xl bg-neutral-800/30 border border-neutral-700/50 hover:bg-neutral-800 hover:border-main/30 transition-all duration-300">
                                <BsCheckCircleFill className="text-main text-2xl mt-1 flex-shrink-0" />
                                <span className="text-lg md:text-xl text-neutral-300 font-medium leading-tight">
                                    {t(`list.${index}`)}
                                </span>
                            </div>
                        </AnimatedWrapper>
                    ))}
                </div>
            </div>
        </section>
    );
}
