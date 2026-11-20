"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import StoreBadge from "../../../_components/StoreBadge";

// Real screenshots of MY Hub (Store screenshots, demo accounts), one tab per part of the student's day.
const SHOTS = ["01-lesson-playing", "02-hands-on-lesson", "03-lesson-quiz", "04-graduation-path", "07-templates-library"];

export default function AppShowcase() {
    const t = useTranslations("NotionCoursePage.app");
    const locale = useLocale();
    const lang = locale === "ar" ? "ar" : "en";
    const tabs = t.raw("tabs");
    const [active, setActive] = useState(0);

    return (
        <div>
            <div role="tablist" aria-label={t("tabsLabel")} className="-mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.t}
                        type="button"
                        role="tab"
                        id={`app-tab-${index}`}
                        aria-selected={active === index}
                        aria-controls="app-panel"
                        onClick={() => setActive(index)}
                        className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                            active === index ? "border-main bg-main text-neutral-900" : "border-main/25 text-neutral-200 hover:border-main/60"
                        }`}
                    >
                        {tab.t}
                    </button>
                ))}
            </div>

            <div id="app-panel" role="tabpanel" aria-labelledby={`app-tab-${active}`} className="grid items-center gap-6 lg:grid-cols-[1fr_300px]">
                <div className="overflow-hidden rounded-[18px] border border-main/30 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                    <div className="flex items-center gap-2 border-b border-white/10 bg-[#141210] px-4 py-2.5" dir="ltr">
                        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                        <span className="size-2.5 rounded-full bg-[#febc2e]" />
                        <span className="size-2.5 rounded-full bg-[#28c840]" />
                        <span className="ms-2 text-xs text-neutral-400">MY Hub</span>
                    </div>
                    <Image
                        key={SHOTS[active]}
                        src={`/courses/myhub/${lang}-${SHOTS[active]}.webp`}
                        alt={tabs[active].alt}
                        width={1600}
                        height={900}
                        sizes="(min-width: 1024px) 860px, 100vw"
                        className="h-auto w-full"
                    />
                </div>
                <div>
                    <h3 className="text-2xl font-semibold text-white">{tabs[active].t}</h3>
                    <p className="mt-2 text-[16px] leading-relaxed text-neutral-400">{tabs[active].d}</p>
                    <StoreBadge locale={locale} place="course-app" className="mt-6" />
                    <p className="mt-4 text-sm text-neutral-500">{t("note")}</p>
                </div>
            </div>
        </div>
    );
}
