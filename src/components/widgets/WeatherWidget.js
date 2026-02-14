"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Sun, CloudRain, Wind, Droplets, MapPin, Loader2, RefreshCw, Settings } from "lucide-react";

export default function WeatherWidget({ theme = "dark", defaultCity = "", isPreview = false, isExplorer = false }) {
    const t = useTranslations("WeatherWidget");
    const isDark = theme === "dark";

    const [city, setCity] = useState("");
    const [savedCity, setSavedCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const lastRequestCity = useRef("");

    const getCoordinates = useCallback(async (cityName) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`);
            const data = await response.json();
            if (data.length > 0) return { lat: data[0].lat, lon: data[0].lon, name: data[0].display_name.split(',')[0] };
        } catch (e) { console.error(e); }
        throw new Error("City not found");
    }, []);

    const fetchWeather = useCallback(async (cityName) => {
        if (!cityName) return;
        lastRequestCity.current = cityName;
        const currentRequest = cityName;

        setLoading(true);
        setError(null);
        try {
            const coords = await getCoordinates(cityName);

            if (lastRequestCity.current !== currentRequest) return;

            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m`);
            const data = await response.json();

            if (lastRequestCity.current !== currentRequest) return;

            setWeather({
                temp: Math.round(data.current.temperature_2m),
                humidity: data.current.relative_humidity_2m,
                feelsLike: Math.round(data.current.apparent_temperature),
                wind: data.current.wind_speed_10m,
                code: data.current.weather_code,
                cityFriendly: coords.name
            });
            setSavedCity(cityName);
            if (!isPreview && !isExplorer) localStorage.setItem("weatherCity", cityName);
        } catch (err) {
            if (lastRequestCity.current === currentRequest) {
                setError(t("error"));
            }
        } finally {
            if (lastRequestCity.current === currentRequest) {
                setLoading(false);
            }
        }
    }, [isPreview, isExplorer, t, getCoordinates]);

    useEffect(() => {
        if (isPreview) {
            setWeather({ temp: 24, humidity: 45, feelsLike: 26, wind: 12, code: 0, cityFriendly: "Cairo" });
            return;
        }
        const saved = defaultCity || localStorage.getItem("weatherCity");
        if (saved) fetchWeather(saved);
    }, [isPreview, defaultCity, fetchWeather]);

    const getWeatherIcon = (code) => {
        if (code <= 3) return <Sun className="text-yellow-400" size={64} />;
        if (code <= 67) return <CloudRain className="text-blue-400" size={64} />;
        return <Cloud className="text-gray-400" size={64} />;
    };

    const containerClasses = isDark
        ? "bg-neutral-900/80 border-neutral-800 text-white"
        : "bg-white/80 border-gray-200 text-black";

    if (isPreview) {
        return (
            <div className={`relative overflow-hidden rounded-2xl border p-4 w-full scale-90 origin-top shadow-lg ${containerClasses}`}>
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="text-lg font-bold">24°</h4>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Cairo</p>
                    </div>
                    <Sun className="text-main" size={32} />
                </div>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden rounded-3xl border p-8 shadow-2xl backdrop-blur-md transition-all duration-500 max-w-md mx-auto min-h-[350px] flex flex-col justify-center ${containerClasses}`}>
            <div className={`absolute inset-0 opacity-10 pointer-events-none ${weather?.temp > 25 ? "bg-orange-500" : "bg-blue-500"}`} style={{ filter: "blur(100px)" }} />

            <div className="relative z-10">
                {(!savedCity && !defaultCity && !isExplorer) ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold uppercase tracking-tighter mb-2">{t("title")}</h3>
                            <p className="text-neutral-500 text-sm">{t("enterCity")}</p>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchWeather(city)}
                                className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-main transition-all ${isDark ? "bg-neutral-800 border-neutral-700" : "bg-gray-100 border-gray-200"}`}
                            />
                            <button onClick={() => fetchWeather(city)} className="bg-main text-black px-4 py-2 rounded-xl font-bold">OK</button>
                        </div>
                        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center">
                        <div className="flex justify-between w-full mb-8">
                            <div className="text-left">
                                <h3 className="text-3xl font-bold tracking-tighter uppercase leading-none truncate max-w-[250px]" title={weather?.cityFriendly || defaultCity || savedCity}>
                                    {isExplorer ? defaultCity : (weather?.cityFriendly || (loading ? "..." : (savedCity || defaultCity)))}
                                </h3>
                                <div className="flex items-center gap-1 mt-2 text-neutral-500">
                                    <MapPin size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{t("live")}</span>
                                </div>
                            </div>
                            {!isExplorer && (
                                <button onClick={() => window.open(`/${locale}/tools/weather-widget`, '_blank')} className="p-2 hover:bg-neutral-800/50 rounded-xl transition-colors text-neutral-500 hover:text-white cursor-pointer"><Settings size={18} /></button>
                            )}
                        </div>

                        {loading ? (
                            <div className="py-12"><Loader2 className="animate-spin text-main" size={48} /></div>
                        ) : (
                            <>
                                <div className="mb-10 relative">
                                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                        {getWeatherIcon(weather?.code)}
                                    </motion.div>
                                    <h1 className="text-7xl font-bold tracking-tighter mt-4 relative inline-block">
                                        {weather?.temp || 0}°
                                        <span className="absolute -top-2 -right-4 text-2xl font-medium opacity-20">C</span>
                                    </h1>
                                </div>

                                <div className="grid grid-cols-3 gap-6 w-full pt-8 border-t border-white/5">
                                    <div className="flex flex-col items-center">
                                        <Droplets size={16} className="text-blue-400 mb-2" />
                                        <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">{t("humidity")}</span>
                                        <span className="font-bold">{weather?.humidity || 0}%</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <Wind size={16} className="text-neutral-400 mb-2" />
                                        <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">{t("wind")}</span>
                                        <span className="font-bold">{weather?.wind || 0} <span className="text-[8px] opacity-40">km/h</span></span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <Sun size={16} className="text-yellow-400 mb-2" />
                                        <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">{t("feelsLike")}</span>
                                        <span className="font-bold">{weather?.feelsLike || 0}°</span>
                                    </div>
                                </div>
                            </>
                        )}
                        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
