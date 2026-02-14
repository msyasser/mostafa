"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import AnimatedWrapper from "./AnimatedWrapper";

export default function CaseStudiesSection() {
    const t = useTranslations("HomePage"); // Assuming you'll add translations to HomePage.json or a new file
    const tCase = useTranslations("CaseStudiesPage"); // Reusing title/desc if possible, or new keys
    const locale = useLocale();
    const isArabic = locale === "ar";
    const ArrowIcon = isArabic ? BsArrowLeft : BsArrowRight;

    return (
        <AnimatedWrapper delay={0.2}>
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24">
                <div className="bg-neutral-900 rounded-3xl p-8 md:p-12 lg:p-16 border border-neutral-800 relative overflow-hidden group hover:border-main/30 transition-all duration-500">

                    {/* Background Gradient */}
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-main/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                        {/* Text Content */}
                        <div className="text-left">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                {tCase("heroTitle")}
                            </h2>
                            <p className="text-gray-400 text-lg md:text-xl mb-8 leading-relaxed max-w-xl">
                                {tCase("heroSubtitle")}
                            </p>

                            <Link
                                href={`/${locale}/services`}
                                className="inline-flex items-center gap-3 text-main font-semibold text-lg hover:text-white transition-colors group/link"
                            >
                                <span className="border-b border-main group-hover/link:border-white transition-colors pb-1">
                                    {isArabic ? "شاهد قصص النجاح" : "View Success Stories"}
                                </span>
                                <ArrowIcon className="text-xl transform group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Visual/Statistic Stats - Placeholder for now, can be an image or grid of stats */}
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-neutral-800/50 p-6 rounded-2xl border border-neutral-700/50 text-center">
                                <span className="block text-4xl md:text-5xl font-bold text-white mb-2">50+</span>
                                <span className="text-sm md:text-base text-gray-400">
                                    {isArabic ? "مشروع مكتمل" : "Projects Completed"}
                                </span>
                            </div>
                            <div className="bg-neutral-800/50 p-6 rounded-2xl border border-neutral-700/50 text-center">
                                <span className="block text-4xl md:text-5xl font-bold text-white mb-2">100%</span>
                                <span className="text-sm md:text-base text-gray-400">
                                    {isArabic ? "رضا العملاء" : "Client Satisfaction"}
                                </span>
                            </div>
                            <div className="bg-neutral-800/50 p-6 rounded-2xl border border-neutral-700/50 text-center col-span-2">
                                <span className="block text-4xl md:text-5xl font-bold text-white mb-2">Global</span>
                                <span className="text-sm md:text-base text-gray-400">
                                    {isArabic ? "عملاء حول العالم" : "Clients Worldwide"}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AnimatedWrapper>
    );
}
