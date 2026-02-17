"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Info, Calendar } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { tools } from "../_data/tools";

export default function ToolExplorer({ slug }) {
    const t = useTranslations("ToolsPage");
    const locale = useLocale();
    const [copied, setCopied] = useState(false);
    const [theme, setTheme] = useState("dark");
    const [configValues, setConfigValues] = useState({});
    const [activeTab, setActiveTab] = useState("configure");

    useEffect(() => {
        // Initialize from localStorage if exists, or use sensible defaults
        const initial = {};
        if (slug === 'ramadan-prayers') {
            initial.city = localStorage.getItem('savedCity') || "Cairo";
        } else if (slug === 'weather-widget') {
            initial.city = localStorage.getItem('weatherCity') || "Cairo";
        } else if (slug === 'event-countdown') {
            initial.date = localStorage.getItem('countdownDate') || "2026-12-31T23:59";
            initial.title = localStorage.getItem('countdownTitle') || "New Year's Eve";
        } else if (slug === 'quran-verse') {
            initial.displayMode = localStorage.getItem('quranDisplayMode') || "both";
            initial.reciter = localStorage.getItem('quranReciter') || "ar.alafasy";
            initial.fontStyle = localStorage.getItem('quranFontStyle') || "uthmani";
        }
        setConfigValues(initial);
    }, [slug]);

    const handleConfigChange = (key, value) => {
        setConfigValues(prev => ({ ...prev, [key]: value }));
        // Sync to localStorage for consistency
        if (slug === 'ramadan-prayers' && key === 'city') localStorage.setItem('savedCity', value);
        if (slug === 'weather-widget' && key === 'city') localStorage.setItem('weatherCity', value);
        if (slug === 'event-countdown') {
            if (key === 'date') localStorage.setItem('countdownDate', value);
            if (key === 'title') localStorage.setItem('countdownTitle', value);
        }
        if (slug === 'quran-verse') {
            if (key === 'displayMode') localStorage.setItem('quranDisplayMode', value);
            if (key === 'reciter') localStorage.setItem('quranReciter', value);
            if (key === 'fontStyle') localStorage.setItem('quranFontStyle', value);
        }
    };

    const toolData = tools.find((t) => t.slug === slug);

    if (!toolData) {
        return null;
    }

    const ToolComponent = toolData.component;

    const handleCopy = () => {
        const origin = window.location.origin;
        let url = `${origin}/embed/${locale}/${slug}?theme=${theme}`;

        if (toolData.config) {
            toolData.config.forEach(configItem => {
                const key = configItem.key;
                const value = configValues[key] || configItem.defaultValue || "";
                if (value) {
                    url += `&${key}=${encodeURIComponent(value)}`;
                }
            });
        }

        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };


    return (
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Controls & Info */}
            <div className="flex flex-col justify-between lg:h-[600px] lg:sticky lg:top-24">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                            {t(toolData.titleKey)}
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            {t(toolData.descriptionKey)}
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-1 bg-neutral-900 p-1 rounded-2xl border border-neutral-800 w-full overflow-x-auto no-scrollbar">
                        {["configure", "style", "guide"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${activeTab === tab
                                    ? "bg-neutral-800 text-main shadow-lg"
                                    : "text-gray-500 hover:text-white"
                                    }`}
                            >
                                {t(tab)}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[200px]">
                        {/* Tab 1: Configure */}
                        {activeTab === "configure" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {toolData.config ? (
                                    <div className="space-y-4 bg-neutral-900/30 border border-neutral-800 p-6 rounded-2xl">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Parameters</h3>
                                        {toolData.config.map((item) => (
                                            <div key={item.key} className="space-y-2 group">
                                                <label className="text-sm font-bold text-neutral-500 group-focus-within:text-main transition-colors flex items-center gap-2">
                                                    {t(item.labelKey)}
                                                </label>
                                                <div className="relative border-2 border-neutral-800 rounded-2xl bg-black/40 group-focus-within:border-main/50 transition-all overflow-hidden shadow-sm">
                                                    {item.type !== 'select' ? (
                                                        <input
                                                            type={item.type}
                                                            value={configValues[item.key] || ""}
                                                            onChange={(e) => handleConfigChange(item.key, e.target.value)}
                                                            placeholder={item.placeholder}
                                                            className={`
                                                                w-full bg-transparent px-5 py-4 text-white font-medium focus:outline-none 
                                                            [color-scheme:dark] transition-all placeholder:text-neutral-700
                                                            ${item.type === 'datetime-local' ? 'cursor-pointer uppercase text-xs tracking-widest' : ''}
                                                        `}
                                                        />
                                                    ) : (
                                                        <select
                                                            value={configValues[item.key] || item.defaultValue || ""}
                                                            onChange={(e) => handleConfigChange(item.key, e.target.value)}
                                                            className="w-full bg-neutral-900 px-5 py-4 text-white font-medium focus:outline-none [color-scheme:dark] transition-all cursor-pointer appearance-none rounded-2xl"
                                                        >
                                                            {item.options.map((opt) => (
                                                                <option key={opt.value} value={opt.value} className="bg-neutral-900 text-white">
                                                                    {t(opt.labelKey)}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                    {item.type === 'select' && (
                                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    {item.type === 'datetime-local' && (
                                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                                                            <Calendar size={16} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-neutral-900/30 border border-neutral-800 p-8 rounded-2xl text-center">
                                        <p className="text-gray-500 italic">{t("noConfigHint")}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab 2: Style */}
                        {activeTab === "style" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-4 bg-neutral-900/30 border border-neutral-800 p-6 rounded-2xl text-white">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Visual Theme</h3>
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-gray-400">
                                            {t("selectTheme")}
                                        </label>
                                        <div className="bg-neutral-900 border border-neutral-800 p-1 rounded-xl flex w-full">
                                            <button
                                                onClick={() => setTheme("light")}
                                                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all cursor-pointer ${theme === "light"
                                                    ? "bg-white text-black shadow-lg"
                                                    : "text-gray-400 hover:text-white"
                                                    }`}
                                            >
                                                Light
                                            </button>
                                            <button
                                                onClick={() => setTheme("dark")}
                                                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all cursor-pointer ${theme === "dark"
                                                    ? "bg-neutral-800 text-white shadow-lg"
                                                    : "text-gray-400 hover:text-white"
                                                    }`}
                                            >
                                                Dark
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 3: Guide */}
                        {activeTab === "guide" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-6">
                                    <h3 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">{t("howToUse")}</h3>
                                    <ol className="space-y-3 text-gray-400 text-sm list-decimal list-inside">
                                        <li>{t("step1")}</li>
                                        <li>{t("step2")}</li>
                                        <li>{t("step3")}</li>
                                    </ol>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Copy Action - Always Visible */}
                <div className="space-y-4 pt-4 border-t border-neutral-800/50">
                    <button
                        onClick={handleCopy}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-98 shadow-xl flex items-center justify-center gap-2 cursor-pointer ${copied
                            ? "bg-green-500 text-white"
                            : "bg-main hover:bg-white text-black"
                            }`}
                    >
                        {copied ? t("copied") : t("copyEmbed")}
                    </button>
                    <p className="text-gray-500 text-xs text-center uppercase tracking-widest font-bold opacity-50">
                        {t("embedHint")} • {theme} Mode
                    </p>
                </div>
            </div>

            {/* Right Column: Preview */}
            <div className={`
                relative w-full aspect-square lg:aspect-auto lg:h-[600px] rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl transition-colors duration-500 flex items-center justify-center
                ${theme === 'light' ? 'bg-[#FFFFFF]' : 'bg-[#191919]'}
            `}>
                {/* Simulated Notion Interface Elements */}
                <div className="absolute top-0 left-0 w-full h-12 border-b border-inherit flex items-center px-4 gap-2 opacity-50">
                    <div className={`w-3 h-3 rounded-full ${theme === 'light' ? 'bg-gray-300' : 'bg-neutral-700'}`} />
                    <div className={`w-3 h-3 rounded-full ${theme === 'light' ? 'bg-gray-300' : 'bg-neutral-700'}`} />
                    <div className={`w-20 h-2 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-neutral-800'}`} />
                </div>

                <div className="w-full max-w-lg p-4">
                    <ToolComponent
                        theme={theme}
                        defaultCity={configValues.city}
                        initialTitle={configValues.title}
                        initialDate={configValues.date}
                        displayMode={configValues.displayMode}
                        reciter={configValues.reciter}
                        fontStyle={configValues.fontStyle}
                        isExplorer={true}
                    />
                </div>

                <div className="absolute bottom-4 right-6 text-xs font-mono opacity-30 text-gray-500">
                    Notion Preview • {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </div>
            </div>
        </div>
    );
}
