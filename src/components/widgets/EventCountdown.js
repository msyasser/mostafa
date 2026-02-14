"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Settings, X, Check, Clock } from "lucide-react";

export default function EventCountdown({ theme = "dark", initialDate = "", initialTitle = "", isPreview = false, isExplorer = false }) {
    const t = useTranslations("EventCountdown");
    const locale = useLocale();
    const isDark = theme === "dark";

    const [targetDate, setTargetDate] = useState(initialDate);
    const [title, setTitle] = useState(initialTitle);
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (isPreview) {
            setTimeLeft({ d: 12, h: 5, m: 45, s: 30 });
            return;
        }

        const savedDate = initialDate || localStorage.getItem("countdownDate");
        const savedTitle = initialTitle || localStorage.getItem("countdownTitle");
        if (savedDate) setTargetDate(savedDate);
        if (savedTitle) setTitle(savedTitle);
    }, [isPreview, initialDate, initialTitle]);

    useEffect(() => {
        if (isPreview || !targetDate) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const difference = target - now;

            if (difference < 0) {
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
                clearInterval(interval);
            } else {
                setTimeLeft({
                    d: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    h: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((difference % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate, isPreview]);

    const handleSave = () => {
        localStorage.setItem("countdownDate", targetDate);
        localStorage.setItem("countdownTitle", title);
        setIsEditing(false);
    };

    const containerClasses = isDark
        ? "bg-neutral-900/80 border-neutral-800 text-white"
        : "bg-white/80 border-gray-200 text-black";

    if (isPreview) {
        return (
            <div className={`relative overflow-hidden rounded-2xl border p-4 w-full scale-90 origin-top shadow-lg ${containerClasses}`}>
                <div className="text-center mb-2">
                    <span className="text-[10px] text-main font-bold uppercase tracking-widest leading-none">Wedding Day</span>
                </div>
                <div className="flex justify-around items-center">
                    {[{ v: 12, l: "D" }, { v: 5, l: "H" }, { v: 45, l: "M" }].map((item, i) => (
                        <div key={i} className="text-center">
                            <div className="text-lg font-bold leading-none">{(item.v).toString().padStart(2, '0')}</div>
                            <div className="text-[8px] text-neutral-500 uppercase">{item.l}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden rounded-3xl border p-8 shadow-2xl backdrop-blur-md transition-all duration-500 w-full max-w-full mx-auto min-h-[350px] flex flex-col justify-center ${containerClasses}`}>
            <div className={`absolute -bottom-10 -left-10 opacity-5 blur-3xl rounded-full w-40 h-40 bg-main`} />

            <div className="relative z-10 flex flex-col items-center gap-6 w-full">
                {(!targetDate || isEditing) && !isExplorer ? (
                    <div className="w-full space-y-4">
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-bold uppercase tracking-tighter">{t("title")}</h3>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={t("enterEvent")}
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-main transition-all ${isDark ? "bg-neutral-800 border-neutral-700" : "bg-gray-100 border-gray-200"}`}
                            />
                            <input
                                type="datetime-local"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-main transition-all ${isDark ? "bg-neutral-800 border-neutral-700" : "bg-gray-100 border-gray-200"}`}
                            />
                            <button onClick={handleSave} className="w-full bg-main text-black font-bold py-3 rounded-xl transition-all font-bold">SAVE</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center w-full">
                            <div className="flex justify-between items-center mb-2">
                                <div className="w-8" />
                                <span className="text-main font-bold text-xs uppercase tracking-[0.2em]">{t("title")}</span>
                                {!isExplorer ? (
                                    <button onClick={() => window.open(`/${locale}/tools/event-countdown`, '_blank')} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-neutral-500 hover:text-white cursor-pointer"><Settings size={16} /></button>
                                ) : <div className="w-8" />}
                            </div>
                            <h3 className="text-3xl font-bold tracking-tighter uppercase leading-tight">{title || "No Title"}</h3>
                        </div>

                        <div className="grid grid-cols-4 gap-2 w-full">
                            {[
                                { val: timeLeft.d, label: t("days") },
                                { val: timeLeft.h, label: t("hours") },
                                { val: timeLeft.m, label: t("minutes") },
                                { val: timeLeft.s, label: t("seconds") },
                            ].map((unit, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className={`w-full py-4 rounded-2xl flex items-center justify-center font-bold text-2xl border transition-all ${isDark ? "bg-neutral-800/50 border-neutral-700" : "bg-gray-50 border-gray-100"}`}>
                                        <AnimatePresence mode="wait">
                                            <motion.span key={unit.val} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}>
                                                {unit.val.toString().padStart(2, '0')}
                                            </motion.span>
                                        </AnimatePresence>
                                    </div>
                                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-2">{unit.label}</span>
                                </div>
                            ))}
                        </div>

                        {targetDate && (
                            <div className="flex items-center gap-2 text-[10px] text-neutral-500 opacity-50 uppercase tracking-widest mt-2">
                                <Calendar size={12} />
                                <span>{new Date(targetDate).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
