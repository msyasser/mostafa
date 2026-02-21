"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Calendar, Clock, RefreshCcw, Settings } from "lucide-react";

const localTranslations = {
    en: {
        title: "Quranic Planner",
        startLabel: "Where do you want to start?",
        fatihaOption: "Surah Al-Fatiha",
        nasOption: "Surah An-Nas",
        daysLabel: "In how many days do you want to finish?",
        startDateLabel: "Start Date:",
        calculateBtn: "Calculate Plan",
        resetBtn: "Reset Data",
        surah: "Surah",
        fromVerse: "From verse",
        to: "to",
        day: "Day"
    },
    ar: {
        title: "مخطط قرآني",
        startLabel: "من أين تريد أن تبدأ؟",
        fatihaOption: "سورة الفاتحة",
        nasOption: "سورة الناس",
        daysLabel: "في كم يوم تريد ختم القرآن؟",
        startDateLabel: "تاريخ البداية:",
        calculateBtn: "احسب الخطة",
        resetBtn: "حذف البيانات",
        surah: "سورة",
        fromVerse: "من الآية",
        to: "إلى",
        day: "اليوم"
    }
};

function toArabicNumerals(number) {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(number).split('').map(digit => arabicNumerals[digit] || digit).join('');
}

function toArabicDateString(date) {
    const day = toArabicNumerals(date.getDate());
    const month = toArabicNumerals(date.getMonth() + 1);
    const year = toArabicNumerals(date.getFullYear());
    return `${day}/${month}/${year}`;
}

export default function QuranicPlanner({ theme = "dark", initialStartSura = "fatiha", initialDays = "", initialStartDate = "", overrideLocale, isPreview = false, isExplorer = false }) {
    const nextIntlT = useTranslations("QuranPlanner");
    const windowLocale = useLocale();
    const locale = overrideLocale || windowLocale;
    const isDark = theme === "dark";

    // Custom translation resolver to support locale overrides without relying on NextIntl memory caching
    const t = (key) => localTranslations[locale]?.[key] || nextIntlT(key);

    const [startSura, setStartSura] = useState(initialStartSura || "fatiha");
    const [days, setDays] = useState(initialDays || "");
    const [startDate, setStartDate] = useState(initialStartDate || "");
    const [plan, setPlan] = useState([]);

    // API Data state
    const [apiQuranData, setApiQuranData] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Fetch Alquran data
    useEffect(() => {
        let isMounted = true;
        async function fetchQuranData() {
            try {
                const res = await fetch("https://api.alquran.cloud/v1/meta");
                const json = await res.json();

                if (json.data && json.data.surahs && json.data.surahs.references) {
                    const enData = [];
                    const arData = [];
                    let total = 0;

                    json.data.surahs.references.forEach((surah) => {
                        enData.push([surah.englishName, surah.numberOfAyahs]);
                        // Strip Harakat (diacritics) for cleaner UI
                        const cleanArabicName = surah.name.replace(/[\u0617-\u061A\u064B-\u0652\u0656-\u065F\u0670]/g, "").replace("سُورَةُ ", "").replace("سورة ", "").trim();
                        arData.push([cleanArabicName, surah.numberOfAyahs]);
                        total += surah.numberOfAyahs;
                    });

                    if (isMounted) {
                        setApiQuranData({ en: enData, ar: arData, totalVerses: total });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch Quran data", error);
            } finally {
                if (isMounted) setIsLoadingData(false);
            }
        }
        fetchQuranData();
        return () => { isMounted = false; };
    }, []);

    // Determine the current locale data
    const localeData = apiQuranData ? (apiQuranData[locale] || apiQuranData.en) : [];
    const totalVerses = apiQuranData ? apiQuranData.totalVerses : 6236;

    useEffect(() => {
        if (isPreview) {
            setDays(30);
            setStartSura("fatiha");
            const today = new Date().toISOString().split("T")[0];
            setStartDate(today);
            return;
        }

        if (initialDays && initialStartDate) {
            setStartSura(initialStartSura || "fatiha");
            setDays(initialDays);
            setStartDate(initialStartDate);
            return;
        }

        const savedStart = localStorage.getItem("quranStart");
        const savedDays = localStorage.getItem("quranDays");
        const savedStartDate = localStorage.getItem("quranStartDate");
        const savedPlan = localStorage.getItem("quranPlan");

        if (savedStart) setStartSura(savedStart);
        if (savedDays) setDays(savedDays);
        if (savedStartDate) setStartDate(savedStartDate);
        if (savedPlan && !initialDays) {
            try {
                const parsed = JSON.parse(savedPlan);
                // invalidate old string-based caches simply
                if (parsed.length > 0 && typeof parsed[0].dayPlan[0] === 'string') {
                    localStorage.removeItem("quranPlan");
                } else {
                    setPlan(parsed);
                }
            } catch (e) {
                console.error("Could not parse saved plan");
            }
        }
    }, [isPreview, initialDays, initialStartDate, initialStartSura]);

    const calculatePlan = useCallback((e) => {
        if (e) e.preventDefault();
        if (!days || !startDate) return;

        let data = [...localeData];
        // Ensure data is loaded from API before calculating
        if (data.length === 0) return;

        const numDays = parseInt(days);
        const startD = new Date(startDate);

        if (isNaN(numDays) || numDays < 1) return;

        let versesPerDay = Math.ceil(totalVerses / numDays);
        let totalProcessedVerses = 0;
        let currentSuraIndex = 0;
        let verseInSura = 0;

        if (startSura === "nas") {
            data = data.reverse();
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let newPlan = [];

        for (let day = 0; day < numDays; day++) {
            let versesLeft = versesPerDay;
            let dayPlan = [];

            while (versesLeft > 0 && totalProcessedVerses < totalVerses) {
                if (currentSuraIndex >= data.length) break;

                let [sura, verses] = data[currentSuraIndex];
                let versesToRead = Math.min(versesLeft, verses - verseInSura);

                if (versesToRead <= 0) {
                    currentSuraIndex++;
                    verseInSura = 0;
                    continue;
                }

                let startVerse = verseInSura + 1;
                let endVerse = verseInSura + versesToRead;

                dayPlan.push({
                    suraIndex: currentSuraIndex,
                    startVerse,
                    endVerse
                });

                verseInSura += versesToRead;
                totalProcessedVerses += versesToRead;
                versesLeft -= versesToRead;

                if (verseInSura >= verses) {
                    currentSuraIndex++;
                    verseInSura = 0;
                }
            }

            let currentDay = new Date(startD);
            currentDay.setDate(startD.getDate() + day);
            currentDay.setHours(0, 0, 0, 0);

            let isToday = currentDay.getTime() === today.getTime();

            newPlan.push({ dayIndex: day, date: currentDay.toISOString(), dayPlan, isToday });
        }

        setPlan(newPlan);

        if (!isPreview && !initialDays) {
            localStorage.setItem("quranStart", startSura);
            localStorage.setItem("quranDays", days.toString());
            localStorage.setItem("quranStartDate", startDate);
            localStorage.setItem("quranPlan", JSON.stringify(newPlan));
        }
    }, [days, startDate, startSura, isPreview, initialDays, localeData]);

    // Auto calculate plan when in preview or embed mode
    useEffect(() => {
        if (isPreview || initialDays) {
            calculatePlan();
        }
    }, [isPreview, initialDays, calculatePlan]);

    const resetData = () => {
        setStartSura("fatiha");
        setDays("");
        setStartDate("");
        setPlan([]);
        if (!isPreview) {
            localStorage.removeItem("quranStart");
            localStorage.removeItem("quranDays");
            localStorage.removeItem("quranStartDate");
            localStorage.removeItem("quranPlan");
        }
    };

    const containerClasses = isDark
        ? "bg-neutral-900/80 border-neutral-800 text-white"
        : "bg-white/80 border-gray-200 text-black";

    const inputClasses = isDark
        ? "bg-neutral-800 border-neutral-700 text-white focus:ring-main/50"
        : "bg-gray-100 border-gray-200 text-black focus:ring-main/50";

    const getVerseText = (verseObj) => {
        let suraName = localeData[verseObj.suraIndex][0];
        if (locale === "ar") {
            return `سورة ${suraName}: من الآية ${toArabicNumerals(verseObj.startVerse)} إلى ${toArabicNumerals(verseObj.endVerse)}`;
        }
        return `${t("surah")} ${suraName}: ${t("fromVerse")} ${verseObj.startVerse} ${t("to")} ${verseObj.endVerse}`;
    };

    const getDayText = (dayIndex, dateIso) => {
        let currentDay = new Date(dateIso);
        let dateString = locale === "ar" ? toArabicDateString(currentDay) : currentDay.toLocaleDateString("en-US");
        if (locale === "ar") {
            return `اليوم ${toArabicNumerals(dayIndex + 1)} (${dateString})`;
        }
        return `${t("day")} ${dayIndex + 1} (${dateString})`;
    };

    if (isLoadingData) {
        if (isPreview) {
            return (
                <div dir={locale === "ar" ? "rtl" : "ltr"} className={`relative overflow-hidden rounded-2xl border p-4 w-full scale-90 origin-top shadow-lg flex items-center justify-center min-h-[120px] ${containerClasses}`}>
                    <div className="w-6 h-6 rounded-full border-2 border-main border-t-transparent animate-spin" />
                </div>
            );
        }
        return (
            <div dir={locale === "ar" ? "rtl" : "ltr"} className={`relative overflow-hidden rounded-[2.5rem] border p-8 shadow-2xl backdrop-blur-xl flex items-center justify-center min-h-[450px] w-full max-w-full mx-auto ${containerClasses}`}>
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <BookOpen size={40} className="text-main opacity-50" />
                    <span className="text-sm font-bold opacity-50">{locale === 'ar' ? 'جاري تحميل بيانات السور...' : 'Loading Quranic data...'}</span>
                </div>
            </div>
        );
    }

    if (isPreview) {
        return (
            <div dir={locale === "ar" ? "rtl" : "ltr"} className={`relative overflow-hidden rounded-2xl border p-4 w-full scale-90 origin-top shadow-lg ${containerClasses}`}>
                <div className="flex justify-between items-center mb-3">
                    <h4 className={`text-sm font-bold uppercase ${locale === 'ar' ? '' : 'tracking-tighter'}`}>{t("title")}</h4>
                    <BookOpen className="text-main" size={16} />
                </div>
                <div className="h-1.5 w-full bg-black/20 rounded-full mb-3 overflow-hidden">
                    <div className="h-full bg-main transition-all w-1/3" />
                </div>
                <div className="space-y-2 opacity-60">
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                        <Calendar size={10} />
                        <span className="truncate">{t("daysLabel")} {days}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                        <BookOpen size={10} className="text-main" />
                        <span className="truncate">{t("startLabel")} {t("fatihaOption")}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            dir={locale === "ar" ? "rtl" : "ltr"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-[2.5rem] border p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 w-full max-w-full mx-auto min-h-[450px] flex flex-col ${containerClasses}`}
        >
            <div className="absolute -top-10 -right-10 opacity-10 blur-3xl rounded-full w-40 h-40 bg-main" />

            <div className="relative z-10 w-full space-y-6">
                <div className="text-center">
                    <div className="flex justify-center mb-2 relative">
                        <div className="p-3 bg-main/10 rounded-2xl">
                            <BookOpen className="text-main" size={24} />
                        </div>
                        {!isExplorer && (
                            <button
                                onClick={() => window.open(`/${locale}/tools/quran-planner`, '_blank')}
                                className={`absolute top-0 p-2 hover:bg-neutral-800/50 rounded-xl transition-colors text-neutral-500 hover:text-white cursor-pointer ${locale === 'ar' ? 'left-0' : 'right-0'}`}
                            >
                                <Settings size={18} />
                            </button>
                        )}
                    </div>
                    <h3 className={`text-3xl font-black uppercase leading-none mb-1 ${locale === 'ar' ? '' : 'tracking-tighter'}`}>{t("title")}</h3>
                </div>

                {!isExplorer && !initialDays && (
                    <form onSubmit={calculatePlan} className="space-y-5">
                        <div className="flex flex-col gap-1.5">
                            <label className={`text-sm font-bold ${locale === 'ar' ? '' : 'tracking-tight'}`}>{t("startLabel")}</label>
                            <select
                                value={startSura}
                                onChange={(e) => setStartSura(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${inputClasses}`}
                            >
                                <option value="fatiha">{t("fatihaOption")}</option>
                                <option value="nas">{t("nasOption")}</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5 justify-end">
                                <label className={`text-sm font-bold ${locale === 'ar' ? '' : 'tracking-tight'}`}>{t("daysLabel")}</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={days}
                                    onChange={(e) => setDays(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all mt-auto ${inputClasses}`}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 justify-end">
                                <label className={`text-sm font-bold ${locale === 'ar' ? '' : 'tracking-tight'}`}>{t("startDateLabel")}</label>
                                <input
                                    type="date"
                                    required
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all mt-auto ${inputClasses}`}
                                    style={isDark ? { colorScheme: 'dark' } : {}}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button
                                type="submit"
                                className="flex-1 bg-main text-black py-3 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <Calendar size={18} />
                                {t("calculateBtn")}
                            </button>
                            <button
                                type="button"
                                onClick={resetData}
                                className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 py-3 rounded-xl font-bold hover:bg-red-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCcw size={18} />
                                {t("resetBtn")}
                            </button>
                        </div>
                    </form>
                )}

                {plan.length > 0 && (
                    <div className={`mt-6 space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar p-1`}>
                        <AnimatePresence>
                            {plan.map((dayPlan, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl border ${dayPlan.isToday ? 'bg-main/20 border-main border-2 shadow-[0_0_20px_rgba(var(--main-rgb),0.3)]' : `${isDark ? 'bg-neutral-800/50 border-neutral-700' : 'bg-gray-50 border-gray-200'}`}`}
                                >
                                    {/* Header Row */}
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${dayPlan.isToday ? 'bg-main text-black shadow-[0_0_15px_rgba(var(--main-rgb),0.5)]' : 'bg-neutral-800 text-main'}`}>
                                                <BookOpen size={14} className={dayPlan.isToday ? 'text-black' : 'text-main'} />
                                            </div>
                                            <h5 className={`font-bold tracking-wide ${dayPlan.isToday ? 'text-main text-xl font-black' : 'text-white text-lg'}`}>
                                                {getDayText(dayPlan.dayIndex, dayPlan.date)}
                                            </h5>
                                        </div>

                                        {dayPlan.isToday && (
                                            <span className="text-[10px] tracking-widest uppercase font-bold text-main border border-main/30 px-3 py-1 rounded-full bg-main/10 backdrop-blur-sm">
                                                {locale === 'ar' ? 'ورد اليوم' : 'Daily Goal'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Verses List */}
                                    <div className="space-y-3">
                                        {dayPlan.dayPlan.map((verse, vIndex) => (
                                            <div key={vIndex} className="flex items-start gap-3 group-hover:translate-x-1 transition-transform">
                                                <span className="text-main/50 mt-1 select-none font-serif text-lg">✦</span>
                                                <span className={`text-[17px] leading-relaxed font-medium ${dayPlan.isToday ? 'text-neutral-200' : 'text-neutral-400 text-[16px]'}`}>
                                                    {getVerseText(verse)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
