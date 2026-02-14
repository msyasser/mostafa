"use client";

import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function ProcessSteps() {
    const t = useTranslations("ServicesPage.process");

    const steps = [0, 1, 2, 3, 4];

    return (
        <section className="py-24 bg-neutral-900 border-b border-neutral-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>

            <div className="max-w-6xl mx-auto px-6 lg:px-12">
                <AnimatedWrapper>
                    <div className="text-center mb-20">
                        <span className="text-main font-mono text-sm tracking-widest uppercase mb-4 block">Methodology</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            {t("title")}
                        </h2>
                        <div className="w-24 h-1 bg-main mx-auto rounded-full"></div>
                    </div>
                </AnimatedWrapper>

                <div className="relative">
                    {/* Vertical Line for Process */}
                    <div className="absolute left-[32px] md:left-1/2 top-0 bottom-0 w-px bg-neutral-800 md:-translate-x-1/2 z-0 hidden md:block"></div>

                    <div className="space-y-12 md:space-y-24 relative z-10">
                        {steps.map((stepIndex) => (
                            <AnimatedWrapper key={stepIndex} delay={stepIndex * 0.1}>
                                <div className={`relative flex flex-col md:flex-row items-center w-full group ${stepIndex % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>

                                    {/* Center Connector (Desktop) - Absolute Centered */}
                                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 rounded-full border-4 border-neutral-900 bg-neutral-800 z-20 shadow-xl group-hover:border-main transition-colors duration-300">
                                        <div className="w-3 h-3 bg-main rounded-full"></div>
                                    </div>

                                    {/* Step Content Wrapper */}
                                    <div className={`w-full md:w-1/2 ${stepIndex % 2 === 0 ? "md:pr-16" : "md:pl-16"}`}>
                                        <div className={`p-6 md:p-8 rounded-2xl bg-neutral-800/20 border border-neutral-700 hover:bg-neutral-800/40 transition-all duration-300 text-left relative group h-full`}>
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-main/10 to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            <div className="text-6xl font-black text-neutral-800 absolute -top-10 -left-4 z-0 opacity-20 group-hover:text-neutral-700 transition-colors pointer-events-none select-none">
                                                0{stepIndex + 1}
                                            </div>

                                            <h3 className="text-2xl font-bold text-white mb-3 relative z-10 group-hover:text-main transition-colors">
                                                {t(`steps.${stepIndex}.title`)}
                                            </h3>
                                            <p className="text-neutral-400 leading-relaxed font-light relative z-10">
                                                {t(`steps.${stepIndex}.description`)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Empty Spacer (Desktop) */}
                                    <div className="hidden md:block w-1/2"></div>
                                </div>
                            </AnimatedWrapper>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
