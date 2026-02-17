"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";
import { Settings, RefreshCw } from "lucide-react";

// Function to get a random verse ID seeded by the date for "Daily" consistency
// Total verses in Quran: 6236
const getDailyVerseId = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const dateString = today.toISOString().split('T')[0];
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }

    // Ensure positive index within range 1-6236
    return (Math.abs(hash) % 6236) + 1;
};

export default function QuranWidget({ theme = "dark", isPreview = false }) {
    const locale = useLocale();
    const isDark = theme === "dark";

    // Theme classes
    const containerClass = isDark
        ? "bg-neutral-900 border border-neutral-800 text-white"
        : "bg-white border border-gray-200 text-black";

    const arabicTextClass = isDark ? "text-white" : "text-black";
    const translationTextClass = isDark ? "text-gray-400" : "text-gray-600";
    const surahInfoClass = isDark ? "text-main" : "text-main"; // Use site's main gold color
    const iconClass = isDark ? "text-neutral-500 hover:text-white" : "text-gray-400 hover:text-black";

    const [verseData, setVerseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);



    const fetchVerse = useCallback(async (id = null) => {
        setLoading(true);
        setError(false);
        try {
            const verseId = id || getDailyVerseId();
            // Fetch Arabic (quran-uthmani) and English (en.asad) editions
            const response = await fetch(`https://api.alquran.cloud/v1/ayah/${verseId}/editions/quran-uthmani,en.asad`);
            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();
            if (data.status === "OK" && data.data && data.data.length >= 2) {
                setVerseData({
                    arabic: data.data[0],
                    english: data.data[1],
                    surah: data.data[0].surah
                });
            } else {
                throw new Error("Invalid data format");
            }
        } catch (err) {
            console.error("Error fetching Quran verse:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVerse();
    }, [fetchVerse]);

    const handleRefresh = (e) => {
        e.stopPropagation(); // Prevent opening the link if there was one
        // Pick a random verse for "shuffle" functionality
        const randomId = Math.floor(Math.random() * 6236) + 1;
        fetchVerse(randomId);
    };

    if (loading) {
        return (
            <div className={`${containerClass} rounded-2xl p-8 w-full max-w-full mx-auto shadow-xl flex items-center justify-center min-h-[200px]`}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main"></div>
            </div>
        );
    }

    if (error || !verseData) {
        return (
            <div className={`${containerClass} rounded-2xl p-8 w-full max-w-full mx-auto shadow-xl flex flex-col items-center justify-center min-h-[200px] gap-4`}>
                <p className="text-red-500">Failed to load verse.</p>
                <button
                    onClick={() => fetchVerse()}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={`${containerClass} rounded-2xl ${isPreview ? 'p-4' : 'p-6 md:p-8'} w-full max-w-full mx-auto shadow-xl relative group transition-colors duration-300 flex flex-col items-center text-center`}>
            {/* Header / Actions */}
            <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleRefresh}
                    title="Random Verse"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${iconClass}`}
                >
                    <RefreshCw size={16} />
                </button>
                <button
                    onClick={() => window.open(`/${locale}/tools/quran-verse`, '_blank')}
                    title="Settings"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${iconClass}`}
                >
                    <Settings size={16} />
                </button>
            </div>

            {/* Decorative Icon - Removed to match minimalist style, or use main color if kept */}
            <div className={`text-4xl absolute top-6 left-6 font-serif opacity-20 ${arabicTextClass}`}>
                ۞
            </div>

            {/* Content */}
            <div className={`w-full ${isPreview ? 'space-y-3' : 'space-y-6'}`}>
                {/* Arabic Text */}
                <p
                    className={`text-2xl md:text-3xl font-bold leading-loose md:leading-loose font-serif ${arabicTextClass}`}
                    dir="rtl"
                    style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }} // Fallback fonts commonly used for Arabic
                >
                    {isPreview && verseData.arabic.text.length > 50 ? verseData.arabic.text.substring(0, 50) + "..." : verseData.arabic.text}
                </p>

                {/* Separator */}
                {!isPreview && <div className="w-16 h-1 bg-main/30 mx-auto rounded-full"></div>}

                {/* Translation */}
                {!isPreview && (
                    <p className={`text-base md:text-lg italic leading-relaxed ${translationTextClass}`}>
                        &quot;{verseData.english.text}&quot;
                    </p>
                )}

                {/* Reference */}
                <div className={`text-sm font-medium tracking-wide uppercase mt-4 ${surahInfoClass}`}>
                    Surah {verseData.surah.englishName} ({verseData.surah.name}) • Verse {verseData.arabic.numberInSurah}
                </div>
            </div>

            {/* Hover gradient effect similar to Quote Widget */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-main via-tertiary to-main opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
    );
}
