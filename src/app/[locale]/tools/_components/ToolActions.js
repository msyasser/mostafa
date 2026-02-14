"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";

export default function ToolActions({ slug }) {
    const t = useTranslations("ToolsPage");
    const locale = useLocale();
    const [copied, setCopied] = useState(false);
    const [theme, setTheme] = useState("dark");

    const handleCopy = () => {
        const origin = window.location.origin;
        const url = `${origin}/embed/${locale}/${slug}?theme=${theme}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="flex flex-col items-center mt-8 space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 p-1 rounded-full flex">
                <button
                    onClick={() => setTheme("light")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${theme === "light"
                            ? "bg-white text-black"
                            : "text-gray-400 hover:text-white"
                        }`}
                >
                    Light
                </button>
                <button
                    onClick={() => setTheme("dark")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${theme === "dark"
                            ? "bg-neutral-800 text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                >
                    Dark
                </button>
            </div>

            <div className="flex flex-col items-center">
                <button
                    onClick={handleCopy}
                    className={`px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${copied
                            ? "bg-green-500 text-white"
                            : "bg-main hover:bg-white text-black"
                        }`}
                >
                    {copied ? t("copied") : t("copyEmbed")}
                </button>
                <p className="text-gray-500 text-sm mt-2">
                    {t("embedHint")} ({theme} mode)
                </p>
            </div>
        </div>
    );
}
