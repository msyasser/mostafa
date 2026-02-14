"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, MapPin, RefreshCcw, Loader2, Clock, Settings } from "lucide-react";

export default function RamadanPrayers({ theme = "dark", defaultCity = "", isPreview = false, isExplorer = false }) {
    const t = useTranslations("RamadanPrayers");
    const locale = useLocale();
    const isArabic = locale === "ar";
    const isDark = theme === "dark";

    const [city, setCity] = useState("");
    const [savedCity, setSavedCity] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [hijriDate, setHijriDate] = useState(null);
    const [ramadanStatus, setRamadanStatus] = useState("");
    const [nextPrayer, setNextPrayer] = useState(null);
    const lastRequestCity = useRef("");

    const getCoordinates = useCallback(async (cityName) => {
        const apiKey = "3f3c663b33e341549fe8b87f6fd7985d";

        try {
            const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
                    cityName
                )}&key=${apiKey}`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return {
                    lat: data.results[0].geometry.lat,
                    lng: data.results[0].geometry.lng,
                };
            }
        } catch (e) {
            console.error("OpenCage failed, trying fallback...");
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`
            );
            const data = await response.json();
            if (data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                };
            }
        } catch (e) {
            console.error("Nominatim fallback failed:", e);
        }

        throw new Error("City not found");
    }, []);

    const fetchPrayerTimes = useCallback(async (lat, lng) => {
        const response = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=4`
        );
        const data = await response.json();
        return data.data;
    }, []);

    const calculateRamadanStatus = useCallback((hijri) => {
        if (!hijri) return;
        const currentMonth = parseInt(hijri.month.number, 10);
        const currentDay = parseInt(hijri.day, 10);

        if (currentMonth === 9) {
            setRamadanStatus(t("ramadanDay", { day: currentDay }));
        } else if (currentMonth === 10 && currentDay <= 3) {
            setRamadanStatus(t("eidMubarak"));
        } else {
            const monthsUntil = (9 - currentMonth + 12) % 12;
            const daysUntil = (monthsUntil * 30) - currentDay;
            setRamadanStatus(`${daysUntil > 0 ? daysUntil : 0} ${t("daysUntil")}`);
        }
    }, [t]);

    const findNextPrayer = useCallback((timings) => {
        if (!timings) return;
        const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        let found = null;
        for (const p of prayers) {
            const [h, m] = timings[p].split(":").map(Number);
            const prayerMinutes = h * 60 + m;
            if (prayerMinutes > currentMinutes) {
                found = p;
                break;
            }
        }
        setNextPrayer(found || "Fajr");
    }, []);

    const formatTime = (timeStr) => {
        if (!timeStr) return "--:--";
        const [hours, minutes] = timeStr.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const h = hours % 12 || 12;
        return `${h}:${minutes.toString().padStart(2, "0")} ${period}`;
    };

    const fetchDataByCity = useCallback(async (cityName) => {
        if (!cityName) return;
        lastRequestCity.current = cityName;
        const currentRequest = cityName;

        setLoading(true);
        setError(null);
        try {
            const coords = await getCoordinates(cityName);

            // If user typed more while we were fetching, ignore this result
            if (lastRequestCity.current !== currentRequest) return;

            const data = await fetchPrayerTimes(coords.lat, coords.lng);

            if (lastRequestCity.current !== currentRequest) return;

            setPrayerTimes(data.timings);
            setHijriDate(data.date.hijri);
            calculateRamadanStatus(data.date.hijri);
            findNextPrayer(data.timings);

            setSavedCity(cityName);
            if (!isPreview && !isExplorer) localStorage.setItem("savedCity", cityName);
        } catch (err) {
            if (lastRequestCity.current === currentRequest) {
                setError(t("locationError"));
            }
        } finally {
            if (lastRequestCity.current === currentRequest) {
                setLoading(false);
            }
        }
    }, [t, calculateRamadanStatus, findNextPrayer, getCoordinates, fetchPrayerTimes, isExplorer, isPreview]);

    useEffect(() => {
        if (isPreview) {
            setRamadanStatus("Day 15");
            setNextPrayer("Maghrib");
            return;
        }

        const initialCity = defaultCity || localStorage.getItem("savedCity");
        if (initialCity) {
            fetchDataByCity(initialCity);
        }
    }, [defaultCity, isPreview, fetchDataByCity]);

    const resetCity = () => {
        localStorage.removeItem("savedCity");
        setSavedCity("");
        setPrayerTimes(null);
    };

    const containerClasses = isDark
        ? "bg-neutral-900/80 border-neutral-800 text-white"
        : "bg-white text-black border-none shadow-none";

    if (isPreview) {
        return (
            <div className={`relative overflow-hidden rounded-2xl border p-4 w-full scale-90 origin-top shadow-lg ${containerClasses}`}>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-main font-bold text-[10px] uppercase tracking-widest leading-none">Day 15</span>
                    <h3 className="text-lg font-bold tracking-tighter uppercase leading-none">{t("ramadan")}</h3>
                </div>
                <div className="space-y-2 opacity-60">
                    {["Fajr", "Maghrib"].map((p) => (
                        <div key={p} className="flex justify-between items-center text-xs p-2 rounded-lg border border-white/5">
                            <span className="font-medium text-neutral-400">{t(p.toLowerCase())}</span>
                            <span className="font-mono text-main">--:--</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-3xl border p-6 shadow-2xl backdrop-blur-md transition-all duration-500 w-full max-w-full mx-auto min-h-[400px] flex flex-col justify-center ${containerClasses}`}
        >
            <div className="absolute -top-10 -right-10 opacity-10 blur-2xl">
                <Moon size={200} fill="currentColor" />
            </div>

            <div className="relative z-10 w-full">
                {(!savedCity && !defaultCity && !isExplorer) ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold tracking-tighter uppercase mb-1">{t("ramadan")}</h3>
                            <p className="text-neutral-500 text-sm">{t("enterCity")}</p>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchDataByCity(city)}
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-main transition-all ${isDark ? "bg-neutral-800 border-neutral-700" : "bg-gray-100 border-gray-200"}`}
                            />
                            <button onClick={() => fetchDataByCity(city)} className="bg-main text-black px-4 py-2 rounded-xl font-bold">OK</button>
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-main font-bold text-xs uppercase tracking-widest block mb-1">{ramadanStatus}</span>
                                <h3 className="text-3xl font-bold tracking-tighter uppercase leading-none">{t("ramadan")}</h3>
                                <p className="text-neutral-500 text-sm mt-1 max-w-[200px] truncate" title={defaultCity || savedCity}>
                                    {isExplorer ? defaultCity : (savedCity || defaultCity)}
                                </p>
                            </div>
                            {!isExplorer && (
                                <button onClick={() => window.open(`/${locale}/tools/ramadan-prayers`, '_blank')} className="p-2 rounded-full hover:bg-neutral-800/50 transition-colors text-neutral-500 hover:text-white cursor-pointer"><Settings size={18} /></button>
                            )}
                        </div>

                        <div className="grid gap-3">
                            {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((p) => {
                                const isNext = nextPrayer === p;
                                return (
                                    <div key={p} className={`flex items-center justify-between p-4 rounded-2xl border ${isNext ? "bg-main/10 border-main/50" : isDark ? "bg-neutral-800/50 border-neutral-700" : "bg-gray-50 border-gray-100"}`}>
                                        <div className="flex items-center gap-3">
                                            <span className={`font-bold ${isNext ? "text-main" : ""}`}>{t(p.toLowerCase())}</span>
                                        </div>
                                        <span className="font-mono text-lg">{prayerTimes ? formatTime(prayerTimes[p]) : "--:--"}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
