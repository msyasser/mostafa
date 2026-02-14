"use client";

import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function AboutHero() {
    const t = useTranslations("AboutPage.hero");

    return (
        <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden">
            {/* Background Blueprint Grid */}
            <div className="absolute inset-0 bg-grid-pattern pointer-events-none"></div>

            {/* Glow Effects */}
            <div className="absolute top-0 w-full h-full bg-neutral-950/80 pointer-events-none"></div>
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-main/10 blur-[120px] rounded-full pointer-events-none"></div>

            <AnimatedWrapper>
                <div className="relative z-10 flex flex-col items-center">
                    <span className="px-4 py-2 rounded-full border border-neutral-700 bg-neutral-900/50 text-main text-sm font-mono tracking-widest uppercase mb-8 backdrop-blur-md">
                        {t("badge")}
                    </span>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1] mb-8 max-w-4xl tracking-tight">
                        {t("title")}
                    </h1>

                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-main to-transparent rounded-full mb-8"></div>

                    <p className="text-xl sm:text-2xl text-neutral-300 max-w-2xl leading-relaxed font-light">
                        {t("subtitle")}
                    </p>
                </div>
            </AnimatedWrapper>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-500 text-sm font-mono"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-neutral-500 to-transparent"></div>
            </motion.div>
        </section>
    );
}
