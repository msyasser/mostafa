"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Settings } from "lucide-react";

export default function LifeProgressWidget({ theme = "dark" }) {
    const locale = useLocale();
    const isDark = theme === "dark";
    const containerClass = isDark
        ? "bg-neutral-900 border border-neutral-800"
        : "bg-white border border-gray-200";
    const titleClass = isDark ? "text-white" : "text-black";
    const labelClass = isDark ? "text-gray-400" : "text-gray-600";
    const barBgClass = isDark ? "bg-neutral-800" : "bg-gray-200";

    const [progress, setProgress] = useState({
        day: 0,
        month: 0,
        year: 0,
    });

    useEffect(() => {
        const calculateProgress = () => {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const endOfDay = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1
            );
            const dayProgress =
                ((now - startOfDay) / (endOfDay - startOfDay)) * 100;

            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            const monthProgress =
                ((now - startOfMonth) / (endOfMonth - startOfMonth)) * 100;

            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
            const yearProgress =
                ((now - startOfYear) / (endOfYear - startOfYear)) * 100;

            setProgress({
                day: dayProgress,
                month: monthProgress,
                year: yearProgress,
            });
        };

        calculateProgress();
        const interval = setInterval(calculateProgress, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`${containerClass} rounded-2xl p-6 w-full max-w-full mx-auto shadow-xl space-y-4 transition-colors duration-300 relative group`}>
            <div className="flex justify-between items-center mb-2">
                <h3 className={`text-xl font-bold ${titleClass}`}>
                    Year Progress
                </h3>
                <button
                    onClick={() => window.open(`/${locale}/tools/year-progress`, '_blank')}
                    className="p-1.5 hover:bg-neutral-800/50 rounded-lg transition-colors text-neutral-500 hover:text-white cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                    <Settings size={16} />
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <div className={`flex justify-between text-sm mb-1 ${labelClass}`}>
                        <span>Day</span>
                        <span>{Math.round(progress.day)}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${barBgClass}`}>
                        <div
                            className="h-full bg-main transition-all duration-500 ease-out"
                            style={{ width: `${progress.day}%` }}
                        />
                    </div>
                </div>

                <div>
                    <div className={`flex justify-between text-sm mb-1 ${labelClass}`}>
                        <span>Month</span>
                        <span>{Math.round(progress.month)}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${barBgClass}`}>
                        <div
                            className="h-full bg-blue-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress.month}%` }}
                        />
                    </div>
                </div>

                <div>
                    <div className={`flex justify-between text-sm mb-1 ${labelClass}`}>
                        <span>Year</span>
                        <span>{Math.round(progress.year)}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${barBgClass}`}>
                        <div
                            className="h-full bg-purple-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress.year}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
