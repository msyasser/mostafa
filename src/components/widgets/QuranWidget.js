"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Settings, RefreshCw, Volume2, VolumeX, Play, Pause, BookOpen } from "lucide-react";

// Google Fonts Configuration
const googleFonts = {
    uthmani: {
        url: "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap",
        family: "'Amiri', serif"
    },
    indopak: {
        url: "https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap",
        family: "'Noto Nastaliq Urdu', serif"
    },
    clean: {
        url: "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap",
        family: "'Tajawal', sans-serif"
    },
    ruqaa: {
        url: "https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&display=swap",
        family: "'Aref Ruqaa', serif"
    },
    kufi: {
        url: "https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400;700&display=swap",
        family: "'Reem Kufi', sans-serif"
    },
    messiri: {
        url: "https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;700&display=swap",
        family: "'El Messiri', sans-serif"
    }
};

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
        hash |= 0;
    }
    return (Math.abs(hash) % 6236) + 1;
};

export default function QuranWidget({ theme = "dark", isPreview = false, displayMode = "both", reciter = "ar.alafasy", fontStyle = "uthmani" }) {
    const locale = useLocale();
    const isDark = theme === "dark";
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const t = useTranslations("ToolsPage");

    // Determine active font config
    const activeFont = googleFonts[fontStyle] || googleFonts.uthmani;


    // Theme classes
    const containerClass = isDark
        ? "bg-neutral-950 border border-neutral-800 text-white shadow-2xl shadow-black/50"
        : "bg-white border border-gray-100 text-black shadow-xl shadow-gray-200/50";

    const arabicTextClass = isDark ? "text-main" : "text-neutral-800";
    const translationTextClass = isDark ? "text-neutral-400" : "text-neutral-600";
    const surahInfoClass = isDark ? "text-main/80" : "text-main";
    const controlsClass = isDark
        ? "bg-neutral-900/50 border-t border-white/5 text-neutral-400"
        : "bg-gray-50/80 border-t border-black/5 text-gray-500";
    const buttonHoverClass = isDark ? "hover:text-white hover:bg-white/10" : "hover:text-black hover:bg-black/5";

    const [verseData, setVerseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchVerse = useCallback(async (id = null) => {
        setLoading(true);
        setError(false);
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }

        try {
            const verseId = id || getDailyVerseId();
            // Use 'quran-uthmani' as base for text content to ensure consistency, 
            // unless its Indopak which has specific glyphs
            const edition = fontStyle === 'indopak' ? 'quran-indopak' : 'quran-uthmani';

            const response = await fetch(`https://api.alquran.cloud/v1/ayah/${verseId}/editions/${edition},en.asad,${reciter}`);
            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();
            if (data.status === "OK" && data.data && data.data.length >= 3) {
                setVerseData({
                    arabic: data.data[0],
                    english: data.data[1],
                    audio: data.data[2],
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
    }, [reciter, fontStyle]);

    useEffect(() => {
        fetchVerse();
    }, [fetchVerse]);

    const handleRefresh = (e) => {
        e.stopPropagation();
        const randomId = Math.floor(Math.random() * 6236) + 1;
        fetchVerse(randomId);
    };

    const toggleAudio = (e) => {
        e.stopPropagation();
        if (!audioRef.current && verseData?.audio?.audio) {
            audioRef.current = new Audio(verseData.audio.audio);
            audioRef.current.onended = () => setIsPlaying(false);
        }

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    // Inject Font Styles
    useEffect(() => {
        if (!document.getElementById(`font-${fontStyle}`)) {
            const link = document.createElement('link');
            link.id = `font-${fontStyle}`;
            link.rel = 'stylesheet';
            link.href = activeFont.url;
            document.head.appendChild(link);
        }
    }, [fontStyle, activeFont.url]);

    if (loading) {
        return (
            <div className={`${containerClass} rounded-2xl p-8 w-full max-w-full mx-auto flex items-center justify-center min-h-[200px]`}>
                <div className="relative">
                    <div className="h-10 w-10 rounded-full border-2 border-neutral-800 border-t-main animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-2 w-2 bg-main rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !verseData) {
        return (
            <div className={`${containerClass} rounded-2xl p-8 w-full max-w-full mx-auto flex flex-col items-center justify-center min-h-[200px] gap-4`}>
                <p className="text-red-500 font-medium">Unable to load verse</p>
                <button
                    onClick={() => fetchVerse()}
                    className="px-5 py-2 bg-main/10 hover:bg-main/20 text-main rounded-full text-sm transition-colors duration-300 flex items-center gap-2"
                >
                    <RefreshCw size={14} /> Retry
                </button>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden rounded-2xl ${containerClass} transition-all duration-300 group`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30-15 30L0 30z' fill='%23d7b180' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px'
                }}
            />

            <div className="relative z-10 flex flex-col h-full">
                {/* Main Content */}
                <div className={`${isPreview ? 'p-5 pb-3' : 'p-8 pb-6'} flex-1 flex flex-col items-center justify-center text-center`}>

                    {/* Decorative Header */}
                    <div className="mb-6 opacity-30 text-main font-serif text-sm tracking-[0.3em] uppercase">
                        {t('dailyVerseLabel')}
                    </div>

                    {/* Arabic Text */}
                    {(displayMode === "both" || displayMode === "arabic") && (
                        <div className="relative mb-6 w-full">
                            <p
                                className={`text-3xl md:text-4xl leading-[2] md:leading-[2.2] ${arabicTextClass}`}
                                dir="rtl"
                                style={{ fontFamily: activeFont.family }}
                            >
                                {isPreview && verseData.arabic.text.length > 50 ? verseData.arabic.text.substring(0, 50) + "..." : verseData.arabic.text}
                            </p>
                            {/* Decorative End Mark */}
                            <span className="inline-block mx-2 text-main opacity-80 text-xl">۝</span>
                        </div>
                    )}

                    {/* Translation */}
                    {(displayMode === "english" || (!isPreview && displayMode === "both")) && (
                        <div className={`relative max-w-2xl mx-auto ${displayMode === "both" ? "pt-6 border-t border-dashed border-main/20" : ""}`}>
                            <p className={`text-base md:text-lg italic font-light leading-relaxed ${translationTextClass}`}>
                                {isPreview && verseData.english.text.length > 50
                                    ? `"${verseData.english.text.substring(0, 50)}..."`
                                    : `"${verseData.english.text}"`}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className={`mt-auto ${controlsClass} backdrop-blur-sm px-6 py-3 flex items-center justify-between`}>

                    {/* Verse Info */}
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-main/10 ${surahInfoClass}`}>
                            <span className="text-xs font-bold">{verseData.arabic.numberInSurah}</span>
                        </div>
                        <div className="text-xs text-left">
                            <div className={`font-bold uppercase tracking-wider ${surahInfoClass}`}>
                                {verseData.surah.englishName}
                            </div>
                            <div className="opacity-60 font-serif">
                                {verseData.surah.name}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 md:gap-2">
                        {!isPreview && (
                            <button
                                onClick={toggleAudio}
                                className={`p-2 rounded-full transition-all duration-300 ${buttonHoverClass} ${isPlaying ? 'text-main bg-main/10' : ''}`}
                                title={isPlaying ? "Pause Recitation" : "Play Recitation"}
                            >
                                {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                            </button>
                        )}

                        <button
                            onClick={handleRefresh}
                            className={`p-2 rounded-full transition-all duration-300 ${buttonHoverClass}`}
                            title="New Verse"
                        >
                            <RefreshCw size={16} />
                        </button>

                        <button
                            onClick={() => window.open(`/${locale}/tools/quran-verse`, '_blank')}
                            className={`p-2 rounded-full transition-all duration-300 ${buttonHoverClass}`}
                            title="Widget Settings"
                        >
                            <Settings size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
