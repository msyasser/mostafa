"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Calendar, Clock, RefreshCcw, Settings } from "lucide-react";

// Quran data for both languages
const quranData = {
    en: [
        ["Al-Fatiha", 7], ["Al-Baqarah", 286], ["Aal-E-Imran", 200], ["An-Nisa", 176], ["Al-Ma'idah", 120],
        ["Al-An'am", 165], ["Al-A'raf", 206], ["Al-Anfal", 75], ["At-Tawbah", 129], ["Yunus", 109],
        ["Hud", 123], ["Yusuf", 111], ["Ar-Ra'd", 43], ["Ibrahim", 52], ["Al-Hijr", 99],
        ["An-Nahl", 128], ["Al-Isra", 111], ["Al-Kahf", 110], ["Maryam", 98], ["Ta-Ha", 135],
        ["Al-Anbiya", 112], ["Al-Hajj", 78], ["Al-Mu'minun", 118], ["An-Nur", 64], ["Al-Furqan", 77],
        ["Ash-Shu'ara", 227], ["An-Naml", 93], ["Al-Qasas", 88], ["Al-Ankabut", 69], ["Ar-Rum", 60],
        ["Luqman", 34], ["As-Sajda", 30], ["Al-Ahzab", 73], ["Saba", 54], ["Fatir", 45],
        ["Ya-Sin", 83], ["As-Saffat", 182], ["Sad", 88], ["Az-Zumar", 75], ["Ghafir", 85],
        ["Fussilat", 54], ["Ash-Shura", 53], ["Az-Zukhruf", 89], ["Ad-Dukhan", 59], ["Al-Jathiya", 37],
        ["Al-Ahqaf", 35], ["Muhammad", 38], ["Al-Fath", 29], ["Al-Hujurat", 18], ["Qaf", 45],
        ["Adh-Dhariyat", 60], ["At-Tur", 49], ["An-Najm", 62], ["Al-Qamar", 55], ["Ar-Rahman", 78],
        ["Al-Waqi'a", 96], ["Al-Hadid", 29], ["Al-Mujadila", 22], ["Al-Hashr", 24], ["Al-Mumtahina", 13],
        ["As-Saff", 14], ["Al-Jumu'a", 11], ["Al-Munafiqun", 11], ["At-Taghabun", 18], ["At-Talaq", 12],
        ["At-Tahrim", 12], ["Al-Mulk", 30], ["Al-Qalam", 52], ["Al-Haqqa", 52], ["Al-Ma'arij", 44],
        ["Nuh", 28], ["Al-Jinn", 28], ["Al-Muzzammil", 20], ["Al-Muddathir", 56], ["Al-Qiyama", 40],
        ["Al-Insan", 31], ["Al-Mursalat", 50], ["An-Naba", 40], ["An-Nazi'at", 46], ["Abasa", 42],
        ["At-Takwir", 29], ["Al-Infitar", 19], ["Al-Mutaffifin", 36], ["Al-Inshiqaq", 25], ["Al-Buruj", 22],
        ["At-Tariq", 17], ["Al-A'la", 19], ["Al-Ghashiya", 26], ["Al-Fajr", 30], ["Al-Balad", 20],
        ["Ash-Shams", 15], ["Al-Lail", 21], ["Ad-Duhaa", 11], ["Ash-Sharh", 8], ["At-Tin", 8],
        ["Al-Alaq", 19], ["Al-Qadr", 5], ["Al-Bayyina", 8], ["Az-Zalzala", 8], ["Al-Adiyat", 11],
        ["Al-Qari'a", 11], ["At-Takathur", 8], ["Al-Asr", 3], ["Al-Humaza", 9], ["Al-Fil", 5],
        ["Quraish", 4], ["Al-Ma'un", 7], ["Al-Kawthar", 3], ["Al-Kafirun", 6], ["An-Nasr", 3],
        ["Al-Masad", 5], ["Al-Ikhlas", 4], ["Al-Falaq", 5], ["An-Nas", 6]
    ],
    ar: [
        ["الفاتحة", 7], ["البقرة", 286], ["آل عمران", 200], ["النساء", 176], ["المائدة", 120],
        ["الأنعام", 165], ["الأعراف", 206], ["الأنفال", 75], ["التوبة", 129], ["يونس", 109],
        ["هود", 123], ["يوسف", 111], ["الرعد", 43], ["إبراهيم", 52], ["الحجر", 99],
        ["النحل", 128], ["الإسراء", 111], ["الكهف", 110], ["مريم", 98], ["طه", 135],
        ["الأنبياء", 112], ["الحج", 78], ["المؤمنون", 118], ["النور", 64], ["الفرقان", 77],
        ["الشعراء", 227], ["النمل", 93], ["القصص", 88], ["العنكبوت", 69], ["الروم", 60],
        ["لقمان", 34], ["السجدة", 30], ["الأحزاب", 73], ["سبأ", 54], ["فاطر", 45],
        ["يس", 83], ["الصافات", 182], ["ص", 88], ["الزمر", 75], ["غافر", 85],
        ["فصلت", 54], ["الشورى", 53], ["الزخرف", 89], ["الدخان", 59], ["الجاثية", 37],
        ["الأحقاف", 35], ["محمد", 38], ["الفتح", 29], ["الحجرات", 18], ["ق", 45],
        ["الذاريات", 60], ["الطور", 49], ["النجم", 62], ["القمر", 55], ["الرحمن", 78],
        ["الواقعة", 96], ["الحديد", 29], ["المجادلة", 22], ["الحشر", 24], ["الممتحنة", 13],
        ["الصف", 14], ["الجمعة", 11], ["المنافقون", 11], ["التغابن", 18], ["الطلاق", 12],
        ["التحريم", 12], ["الملك", 30], ["القلم", 52], ["الحاقة", 52], ["المعارج", 44],
        ["نوح", 28], ["الجن", 28], ["المزمل", 20], ["المدثر", 56], ["القيامة", 40],
        ["الإنسان", 31], ["المرسلات", 50], ["النبأ", 40], ["النازعات", 46], ["عبس", 42],
        ["التكوير", 29], ["الانفطار", 19], ["المطففين", 36], ["الانشقاق", 25], ["البروج", 22],
        ["الطارق", 17], ["الأعلى", 19], ["الغاشية", 26], ["الفجر", 30], ["البلد", 20],
        ["الشمس", 15], ["الليل", 21], ["الضحى", 11], ["الشرح", 8], ["التين", 8],
        ["العلق", 19], ["القدر", 5], ["البينة", 8], ["الزلزلة", 8], ["العاديات", 11],
        ["القارعة", 11], ["التكاثر", 8], ["العصر", 3], ["الهمزة", 9], ["الفيل", 5],
        ["قريش", 4], ["الماعون", 7], ["الكوثر", 3], ["الكافرون", 6], ["النصر", 3],
        ["المسد", 5], ["الإخلاص", 4], ["الفلق", 5], ["الناس", 6]
    ]
};

const totalVerses = quranData.en.reduce((sum, [, verses]) => sum + verses, 0);

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

export default function QuranicPlanner({ theme = "dark", isPreview = false, isExplorer = false }) {
    const t = useTranslations("QuranPlanner");
    const locale = useLocale();
    const isDark = theme === "dark";

    const [startSura, setStartSura] = useState("fatiha");
    const [days, setDays] = useState("");
    const [startDate, setStartDate] = useState("");
    const [plan, setPlan] = useState([]);

    // Determine the current locale data
    const localeData = quranData[locale] || quranData.en;

    useEffect(() => {
        if (isPreview) {
            setDays(30);
            setStartSura("fatiha");
            const today = new Date().toISOString().split("T")[0];
            setStartDate(today);
            return;
        }

        const savedStart = localStorage.getItem("quranStart");
        const savedDays = localStorage.getItem("quranDays");
        const savedStartDate = localStorage.getItem("quranStartDate");
        const savedPlan = localStorage.getItem("quranPlan");

        if (savedStart) setStartSura(savedStart);
        if (savedDays) setDays(savedDays);
        if (savedStartDate) setStartDate(savedStartDate);
        if (savedPlan) {
            try {
                setPlan(JSON.parse(savedPlan));
            } catch (e) {
                console.error("Could not parse saved plan");
            }
        }
    }, [isPreview]);

    const calculatePlan = useCallback((e) => {
        if (e) e.preventDefault();
        if (!days || !startDate) return;

        const numDays = parseInt(days);
        const startD = new Date(startDate);

        if (isNaN(numDays) || numDays < 1) return;

        let versesPerDay = Math.ceil(totalVerses / numDays);
        let totalProcessedVerses = 0;
        let data = [...localeData];
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

                let verseText = locale === "ar"
                    ? `${t("surah")} ${sura}: ${t("fromVerse")} ${toArabicNumerals(startVerse)} ${t("to")} ${toArabicNumerals(endVerse)}`
                    : `${t("surah")} ${sura}: ${t("fromVerse")} ${startVerse} ${t("to")} ${endVerse}`;

                dayPlan.push(verseText);
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
            let dateString = locale === "ar" ? toArabicDateString(currentDay) : currentDay.toLocaleDateString("en-US");

            currentDay.setHours(0, 0, 0, 0);
            let isToday = currentDay.getTime() === today.getTime();

            let dayText = locale === "ar"
                ? `${t("day")} ${toArabicNumerals(day + 1)} (${dateString})`
                : `${t("day")} ${day + 1} (${dateString})`;

            newPlan.push({ dayText, dayPlan, isToday });
        }

        setPlan(newPlan);

        if (!isPreview) {
            localStorage.setItem("quranStart", startSura);
            localStorage.setItem("quranDays", days.toString());
            localStorage.setItem("quranStartDate", startDate);
            localStorage.setItem("quranPlan", JSON.stringify(newPlan));
        }
    }, [days, startDate, startSura, isPreview, localeData, locale, t]);

    // Auto calculate plan when in preview mode
    useEffect(() => {
        if (isPreview && days && startDate) {
            calculatePlan();
        }
    }, [isPreview, days, startDate, calculatePlan]);

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

    if (isPreview) {
        return (
            <div className={`relative overflow-hidden rounded-2xl border p-4 w-full scale-90 origin-top shadow-lg ${containerClasses}`}>
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-bold uppercase tracking-tighter">{t("title")}</h4>
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
                        <button
                            onClick={() => window.open(`/${locale}/tools/quran-planner`, '_blank')}
                            className="absolute right-0 top-0 p-2 hover:bg-neutral-800/50 rounded-xl transition-colors text-neutral-500 hover:text-white cursor-pointer"
                        >
                            <Settings size={18} />
                        </button>
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter uppercase leading-none mb-1">{t("title")}</h3>
                </div>

                <form onSubmit={calculatePlan} className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold tracking-tight">{t("startLabel")}</label>
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
                            <label className="text-sm font-bold tracking-tight">{t("daysLabel")}</label>
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
                            <label className="text-sm font-bold tracking-tight">{t("startDateLabel")}</label>
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
                                    <h5 className={`font-bold mb-3 flex items-center gap-2 ${dayPlan.isToday ? 'text-main text-lg' : ''}`}>
                                        <Clock size={16} />
                                        {dayPlan.dayText}
                                    </h5>
                                    <div className="space-y-1">
                                        {dayPlan.dayPlan.map((verse, vIndex) => (
                                            <div key={vIndex} className="text-sm opacity-80 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-main/50" />
                                                {verse}
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
