"use client";

import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { BsArrowRight, BsGrid1X2 } from "react-icons/bs";
import NotionCalendarButton from "@/src/app/[locale]/_components/NotionCalendarButton";

export default function AboutCTA() {
    const t = useTranslations("AboutPage.cta");
    const locale = useLocale();

    return (
        <section className="py-32 bg-neutral-950 border-t border-neutral-900 relative overflow-hidden text-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-main/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-6">
                <AnimatedWrapper>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 leading-tight">
                        {t("title")}
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <NotionCalendarButton
                            label={t("workWithMe")}
                            className="!px-10 !py-4 shadow-xl shadow-main/20"
                        />

                        <Link
                            href={`/${locale}/templates`}
                            className="bg-neutral-900 text-white font-medium px-10 py-4 rounded-full hover:bg-neutral-800 transition-colors duration-300 border border-neutral-800 flex items-center gap-3 group"
                        >
                            <BsGrid1X2 className="text-xl text-neutral-500 group-hover:text-main transition-colors" />
                            {t("exploreMyWork")}
                        </Link>
                    </div>
                </AnimatedWrapper>
            </div>
        </section>
    );
}
