"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Settings } from "lucide-react";

export default function PomodoroWidget({ theme = "dark" }) {
    const t = useTranslations("HomePage"); // Using HomePage for now, could use a dedicated widget namespace later
    const locale = useLocale();
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState("work"); // 'work' or 'break'

    // Theme-based styles
    const isDark = theme === "dark";
    const containerClass = isDark
        ? "bg-neutral-900 border-neutral-800 text-white"
        : "bg-white border-gray-200 text-black";
    const timerClass = isDark ? "text-main" : "text-black";
    const buttonInactiveClass = isDark
        ? "text-gray-500 hover:text-white"
        : "text-gray-400 hover:text-black";
    const buttonActiveClass = isDark
        ? "bg-white/10 text-white"
        : "bg-black/5 text-black";
    const resetButtonClass = isDark
        ? "bg-neutral-800 hover:bg-neutral-700 text-gray-300"
        : "bg-gray-100 hover:bg-gray-200 text-gray-600";

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        // Timer done
                        setIsActive(false);
                        // Optionally auto-switch or notify
                        if (mode === "work") {
                            setMode("break");
                            setMinutes(5);
                        } else {
                            setMode("work");
                            setMinutes(25);
                        }
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds, minutes, mode]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        if (mode === "work") {
            setMinutes(25);
        } else {
            setMinutes(5);
        }
        setSeconds(0);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        setMinutes(newMode === "work" ? 25 : 5);
        setSeconds(0);
    };

    return (
        <div className={`${containerClass} border rounded-2xl p-6 text-center w-full max-w-md mx-auto shadow-xl transition-colors duration-300`}>
            <div className="flex justify-between items-center mb-4 relative">
                <div className="w-6" /> {/* Spacer */}
                <h3 className="text-xl font-bold">
                    {mode === "work" ? "Focus Time" : "Break Time"}
                </h3>
                <button
                    onClick={() => window.open(`/${locale}/tools/pomodoro`, '_blank')}
                    className="p-1.5 hover:bg-neutral-800/10 rounded-lg transition-colors text-neutral-500 hover:text-current cursor-pointer"
                >
                    <Settings size={18} />
                </button>
            </div>
            <div className={`text-6xl font-mono font-bold mb-6 ${timerClass}`}>
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
            <div className="flex justify-center gap-3 mb-4">
                <button
                    onClick={() => switchMode("work")}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${mode === "work" ? buttonActiveClass : buttonInactiveClass
                        }`}
                >
                    Work
                </button>
                <button
                    onClick={() => switchMode("break")}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${mode === "break" ? buttonActiveClass : buttonInactiveClass
                        }`}
                >
                    Break
                </button>
            </div>
            <div className="flex justify-center gap-4">
                <button
                    onClick={toggleTimer}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${isActive
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : isDark ? "bg-main hover:bg-white text-black" : "bg-black text-white hover:bg-gray-800"
                        }`}
                >
                    {isActive ? "Pause" : "Start"}
                </button>
                <button
                    onClick={resetTimer}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${resetButtonClass}`}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
