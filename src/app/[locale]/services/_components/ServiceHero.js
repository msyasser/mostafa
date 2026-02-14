"use client";

import { motion } from "framer-motion";
import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { BsArrowRight, BsCollectionPlay } from "react-icons/bs";

export default function ServiceHero() {
    const t = useTranslations("ServicesPage.hero");

    return (
        <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-neutral-950">
            {/* Background Blueprint Grid */}
            <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-50"></div>

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-main/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
            </div>

            <AnimatedWrapper>
                <div className="relative z-10 max-w-5xl flex flex-col items-center">
                    <span className="px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/80 text-main text-sm font-mono tracking-widest uppercase mb-8 backdrop-blur-md">
                        System Architect & Notion Certified
                    </span>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-8 tracking-tight">
                        {t("title")}
                    </h1>

                    <p className="text-xl sm:text-2xl text-neutral-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        {t("subtitle")}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="#calendar-section"
                            className="bg-main text-neutral-900 font-bold px-10 py-4 rounded-full hover:scale-105 transition-transform duration-300 shadow-xl shadow-main/20 flex items-center gap-3"
                        >
                            {t("ctaBook")} <BsArrowRight className="text-xl" />
                        </Link>

                        <Link
                            href="#case-studies"
                            className="bg-neutral-900 text-white font-medium px-10 py-4 rounded-full hover:bg-neutral-800 transition-colors duration-300 border border-neutral-800 flex items-center gap-3 group"
                        >
                            <BsCollectionPlay className="text-xl text-neutral-500 group-hover:text-main transition-colors" />
                            {t("ctaCaseStudies")}
                        </Link>
                    </div>
                </div>
            </AnimatedWrapper>
        </section>
    );
}
