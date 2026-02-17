"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { tools } from "../_data/tools";

export default function ToolsGallery() {
    const t = useTranslations("ToolsPage");


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto px-4 mt-8">
            {tools.map((widget) => (
                <div
                    key={widget.slug}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-between shadow-xl"
                >
                    <div className="w-full mb-6">
                        <div className="mb-4 text-center">
                            <Link href={`/tools/${widget.slug}`} className="hover:underline">
                                <h3 className="text-2xl font-bold text-white mb-2">{t(widget.titleKey)}</h3>
                            </Link>
                            <p className="text-gray-400 text-sm">{t(widget.descriptionKey)}</p>
                        </div>
                        <div className="flex justify-center w-full max-h-[300px] overflow-y-auto category-scrollbar pr-2">
                            <widget.component isPreview={true} />
                        </div>
                    </div>

                    <div className="w-full mt-4">
                        <Link
                            href={`/tools/${widget.slug}`}
                            className="block w-full px-4 py-2 rounded-full font-medium transition-all bg-neutral-800 hover:bg-neutral-700 text-white text-center"
                        >
                            {t("openTool")}
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
