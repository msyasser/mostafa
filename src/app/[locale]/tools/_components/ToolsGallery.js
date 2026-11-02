"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { tools } from "../_data/tools";
import LazyPreview from "./LazyPreview";

// The tools nobody else makes in Arabic come first; the common ones (timer, quote, weather) come last
const ORDER = [
    "quran-verse",
    "ramadan-prayers",
    "quran-planner",
    "habit-tracker",
    "asset-tracker",
    "event-countdown",
    "study-planner",
    "weather-widget",
    "pomodoro",
    "year-progress",
    "quote",
];

const sortedTools = [...tools].sort((a, b) => {
    const left = ORDER.indexOf(a.slug);
    const right = ORDER.indexOf(b.slug);
    return (left === -1 ? 99 : left) - (right === -1 ? 99 : right);
});

export default function ToolsGallery() {
    const t = useTranslations("ToolsPage");
    const locale = useLocale();

    return (
        <div className="mx-auto mt-8 w-full max-w-7xl px-4">
            {/* The desktop app */}
            <Link
                href="/tools/tasks-widget"
                data-track="tool_open_click"
                data-track-place="tasks_widget_featured"
                className="group mb-8 grid items-center gap-6 overflow-hidden rounded-2xl border border-main/30 bg-neutral-900 p-5 shadow-xl transition-colors hover:border-main md:grid-cols-2 md:p-6"
            >
                <div>
                    <span className="inline-block rounded-md bg-main px-2.5 py-0.5 text-xs font-semibold text-neutral-900">
                        {t("tasksWidget.badge")}
                    </span>
                    <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">{t("tasksWidget.title")}</h2>
                    <p className="mt-3 text-gray-400">{t("tasksWidget.cardText")}</p>
                    <span className="mt-5 inline-block rounded-full bg-main px-6 py-2.5 font-semibold text-black transition-colors group-hover:bg-white">
                        {t("tasksWidget.cardCta")}
                    </span>
                </div>
                <div className="overflow-hidden rounded-xl border border-white/10">
                    <Image
                        src={`/tasks-widget/${locale === "ar" ? "ar" : "en"}/overview.webp`}
                        alt={t("tasksWidget.title")}
                        width={1600}
                        height={900}
                        sizes="(min-width: 768px) 600px, 100vw"
                        className="h-auto w-full"
                    />
                </div>
            </Link>

            {/* The embeddable widgets */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {sortedTools.map((widget) => (
                    <div
                        key={widget.slug}
                        className="flex flex-col items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl"
                    >
                        <div className="mb-6 w-full">
                            <div className="mb-4 text-center">
                                <Link href={`/tools/${widget.slug}`} className="hover:underline">
                                    <h3 className="mb-2 text-2xl font-bold text-white">{t(widget.titleKey)}</h3>
                                </Link>
                                <p className="text-sm text-gray-400">{t(widget.descriptionKey)}</p>
                            </div>
                            <div className="category-scrollbar max-h-[300px] w-full overflow-y-auto pr-2">
                                <LazyPreview>
                                    <widget.component isPreview={true} />
                                </LazyPreview>
                            </div>
                        </div>

                        <div className="mt-4 w-full">
                            <Link
                                href={`/tools/${widget.slug}`}
                                data-track="tool_open_click"
                                data-track-place={widget.slug}
                                className="block w-full rounded-full bg-neutral-800 px-4 py-2 text-center font-medium text-white transition-all hover:bg-neutral-700"
                            >
                                {t("openTool")}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
