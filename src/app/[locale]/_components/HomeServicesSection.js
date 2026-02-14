"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import Image from "next/image";
import { BsArrowRight, BsArrowLeft, BsLayers, BsHddNetwork, BsLightningCharge, BsGraphUpArrow } from "react-icons/bs";
import AnimatedWrapper from "./AnimatedWrapper";
import AnimatedInView from "./AnimatedInView";
import { projects } from "../services/_data/projects";

const icons = {
    0: BsLayers,
    1: BsHddNetwork,
    2: BsLightningCharge,
    3: BsGraphUpArrow
};

export default function HomeServicesSection() {
    const tServices = useTranslations("ServicesPage");
    const tHome = useTranslations("HomePage");
    const tCaseStudies = useTranslations("CaseStudiesPage");

    const locale = useLocale();
    const isArabic = locale === "ar";
    const ArrowIcon = isArabic ? BsArrowLeft : BsArrowRight;

    return (
        <section className="w-full py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <AnimatedInView threshold={0.1}>
                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            {tHome("servicesTitle")}
                        </h2>
                    </AnimatedInView>
                    <AnimatedInView threshold={0.1}>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mt-2">
                            {tHome("servicesSubtitle")}
                        </p>
                    </AnimatedInView>
                </div>

                {/* Unified Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 auto-rows-[minmax(240px,auto)]">

                    {/* Services (Top Row) */}
                    {[0, 1, 2].map((index) => {
                        const Icon = icons[index];
                        return (
                            <AnimatedWrapper key={`service-${index}`} delay={index * 0.1}>
                                <div className="h-full p-6 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-main/50 transition-all duration-500 hover:shadow-2xl hover:shadow-main/10 flex flex-col items-center justify-center text-center group">
                                    <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4 group-hover:bg-main group-hover:text-black text-main transition-colors duration-500">
                                        <Icon className="text-3xl" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-main transition-colors">
                                        {tServices(`whatIDo.blocks.${index}.title`)}
                                    </h3>
                                    <p className="text-neutral-400 leading-relaxed text-sm md:text-base">
                                        {tServices(`whatIDo.blocks.${index}.description`)}
                                    </p>
                                </div>
                            </AnimatedWrapper>
                        );
                    })}

                    {/* Case Studies (Bottom Row) */}
                    {/* Case Study 1 */}
                    <AnimatedWrapper delay={0.4} className="md:col-span-1">
                        <Link
                            href={`/case-studies/${projects[0].slug}`}
                            className="flex flex-col h-full w-full relative rounded-3xl overflow-hidden group border border-neutral-800 hover:border-main/50 transition-all duration-300 bg-neutral-900"
                        >
                            <div className="relative w-full flex-1 overflow-hidden">
                                <Image
                                    src={projects[0].image}
                                    alt={projects[0].id}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
                                />
                            </div>
                            <div className="p-6 border-t border-neutral-800 bg-neutral-950/30">
                                <h3 className="text-lg font-bold text-white group-hover:text-main transition-colors">
                                    {tCaseStudies(projects[0].titleKey)}
                                </h3>
                            </div>
                        </Link>
                    </AnimatedWrapper>

                    {/* Case Study 2 */}
                    <AnimatedWrapper delay={0.5} className="md:col-span-1">
                        <Link
                            href={`/case-studies/${projects[1].slug}`}
                            className="flex flex-col h-full w-full relative rounded-3xl overflow-hidden group border border-neutral-800 hover:border-main/50 transition-all duration-300 bg-neutral-900"
                        >
                            <div className="relative w-full flex-1 overflow-hidden">
                                <Image
                                    src={projects[1].image}
                                    alt={projects[1].id}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
                                />
                            </div>
                            <div className="p-6 border-t border-neutral-800 bg-neutral-950/30">
                                <h3 className="text-lg font-bold text-white group-hover:text-main transition-colors">
                                    {tCaseStudies(projects[1].titleKey)}
                                </h3>
                            </div>
                        </Link>
                    </AnimatedWrapper>

                    {/* View All Services Card */}
                    <AnimatedWrapper delay={0.6} className="md:col-span-1 h-full">
                        <Link
                            href="/services"
                            className="flex items-center justify-center gap-6 p-6 rounded-3xl bg-neutral-800/50 border border-neutral-700 hover:bg-main hover:border-main transition-all duration-300 group h-full relative overflow-hidden"
                        >
                            <div className="w-16 h-16 rounded-full bg-neutral-700/50 group-hover:bg-white/20 flex items-center justify-center text-white transition-all duration-500 shadow-xl group-hover:shadow-main/20 group-hover:scale-110">
                                <ArrowIcon className="text-2xl group-hover:text-white transition-all duration-300 transform group-hover:rotate-45" />
                            </div>
                            <span className="text-xl md:text-2xl font-bold text-white group-hover:text-black transition-colors">
                                {isArabic ? "عرض كل الخدمات" : "View All Services"}
                            </span>
                        </Link>
                    </AnimatedWrapper>
                </div>
            </div>
        </section>
    );
}
