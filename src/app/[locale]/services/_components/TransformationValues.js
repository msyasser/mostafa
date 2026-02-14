"use client";

import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import { useTranslations } from "next-intl";
import { BsLayers, BsHddNetwork, BsLightningCharge, BsGraphUpArrow } from "react-icons/bs";

const icons = {
    0: BsLayers,
    1: BsHddNetwork,
    2: BsLightningCharge,
    3: BsGraphUpArrow
};

export default function TransformationValues() {
    const t = useTranslations("ServicesPage.whatIDo");

    return (
        <section className="py-24 bg-neutral-900 border-y border-neutral-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <AnimatedWrapper>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-16 text-center">
                        {t("title")}
                    </h2>
                </AnimatedWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[0, 1, 2, 3].map((index) => {
                        const Icon = icons[index];
                        return (
                            <AnimatedWrapper key={index} delay={index * 0.1}>
                                <div className="group h-full p-8 rounded-2xl bg-neutral-800/50 border border-neutral-700 hover:border-main/50 hover:bg-neutral-800 transition-all duration-300">
                                    <div className="w-14 h-14 rounded-xl bg-neutral-700/50 flex items-center justify-center mb-6 group-hover:bg-main/20 group-hover:text-main transition-colors duration-300">
                                        <Icon className="text-2xl text-neutral-300 group-hover:text-main transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-main transition-colors">
                                        {t(`blocks.${index}.title`)}
                                    </h3>
                                    <p className="text-neutral-400 leading-relaxed font-light">
                                        {t(`blocks.${index}.description`)}
                                    </p>
                                </div>
                            </AnimatedWrapper>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
