"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, RotateCcw, Check, Sparkles, MoreHorizontal, Settings } from "lucide-react";

export default function HabitTracker({ theme = "dark", isPreview = false }) {
    const t = useTranslations("HabitTracker");
    const locale = useLocale();
    const isDark = theme === "dark";

    const [habits, setHabits] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newGoal, setNewGoal] = useState(1);

    useEffect(() => {
        if (isPreview) {
            setHabits([
                { id: 1, name: "Reading", current: 5, goal: 10, color: "#d7b180" },
                { id: 2, name: "Workout", current: 1, goal: 1, color: "#777777" }
            ]);
            return;
        }

        const saved = JSON.parse(localStorage.getItem("habits") || "[]");
        setHabits(saved);
    }, [isPreview]);

    const saveHabits = (newHabits) => {
        setHabits(newHabits);
        localStorage.setItem("habits", JSON.stringify(newHabits));
    };

    const addHabit = () => {
        if (!newName) return;
        const colors = ["#d7b180", "#a08a7d", "#777777"];
        const habit = {
            id: Date.now(),
            name: newName,
            goal: parseInt(newGoal) || 1,
            current: 0,
            color: colors[habits.length % colors.length]
        };
        saveHabits([...habits, habit]);
        setNewName("");
        setNewGoal(1);
        setIsAdding(false);
    };

    const updateHabit = (id, delta) => {
        const newHabits = habits.map(h => {
            if (h.id === id) {
                const next = Math.max(0, Math.min(h.goal, h.current + delta));
                return { ...h, current: next };
            }
            return h;
        });
        saveHabits(newHabits);
    };

    const deleteHabit = (id) => {
        saveHabits(habits.filter(h => h.id !== id));
    };

    const containerClasses = isDark
        ? "bg-neutral-900/80 border-neutral-800 text-white"
        : "bg-white/80 border-gray-200 text-black";

    if (isPreview) {
        return (
            <div className={`relative overflow-hidden rounded-2xl border p-4 w-full scale-90 origin-top shadow-lg ${containerClasses}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold tracking-tighter uppercase leading-none">{t("title")}</h3>
                </div>
                <div className="flex gap-4 items-center justify-center">
                    {[75, 40].map((p, i) => (
                        <div key={i} className="relative w-12 h-12">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-10" />
                                <circle cx="24" cy="24" r="20" fill="none" stroke="#d7b180" strokeWidth="4" strokeDasharray={125.6} strokeDashoffset={125.6 * (1 - p / 100)} strokeLinecap="round" />
                            </svg>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden rounded-3xl border p-6 shadow-2xl backdrop-blur-md transition-all duration-500 max-w-md mx-auto min-h-[400px] flex flex-col ${containerClasses}`}>
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold tracking-tighter uppercase leading-none">{t("title")}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.open(`/${locale}/tools/habit-tracker`, '_blank')}
                        className="p-2 hover:bg-neutral-800/50 rounded-xl transition-colors text-neutral-500 hover:text-white cursor-pointer"
                    >
                        <Settings size={18} />
                    </button>
                    <button
                        onClick={() => saveHabits(habits.map(h => ({ ...h, current: 0 })))}
                        className="p-2 hover:bg-neutral-800/50 rounded-xl transition-colors text-neutral-500 hover:text-white cursor-pointer"
                        title={t("resetAll")}
                    >
                        <RotateCcw size={18} />
                    </button>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${isAdding ? "bg-main text-black rotate-45" : "hover:bg-neutral-800/50 text-neutral-500 hover:text-white"}`}
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-6"
                    >
                        <div className={`p-4 rounded-2xl border space-y-4 ${isDark ? "bg-neutral-800 border-neutral-700" : "bg-gray-50 border-gray-200"}`}>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder={t("placeholder")}
                                className={`w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-1 focus:ring-main ${isDark ? "border-neutral-700" : "border-gray-200"}`}
                            />
                            <div className="flex items-center gap-4">
                                <label className="text-xs text-neutral-500 uppercase">{t("dailyGoal")}</label>
                                <input
                                    type="number"
                                    value={newGoal}
                                    onChange={(e) => setNewGoal(e.target.value)}
                                    className={`w-20 px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-1 focus:ring-main ${isDark ? "border-neutral-700" : "border-gray-200"}`}
                                />
                                <button
                                    onClick={addHabit}
                                    className="flex-1 bg-main hover:bg-white text-black font-bold py-2 rounded-xl transition-all"
                                >
                                    {t("save")}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 space-y-4">
                {habits.map((habit) => {
                    const progress = (habit.current / habit.goal) * 100;
                    const circumference = 2 * Math.PI * 34;
                    const offset = circumference - (progress / 100) * circumference;

                    return (
                        <div key={habit.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isDark ? "bg-neutral-800/30 border-neutral-800/50" : "bg-gray-50 border-gray-200"}`}>
                            {/* Circular Progress */}
                            <div className="relative w-20 h-20 group cursor-pointer" onClick={() => updateHabit(habit.id, 1)}>
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" className="opacity-10" />
                                    <motion.circle
                                        cx="40" cy="40" r="34"
                                        fill="none"
                                        stroke={habit.color}
                                        strokeWidth="6"
                                        strokeDasharray={circumference}
                                        initial={{ strokeDashoffset: circumference }}
                                        animate={{ strokeDashoffset: offset }}
                                        strokeLinecap="round"
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    {progress >= 100 ? (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-main">
                                            <Sparkles size={20} />
                                        </motion.div>
                                    ) : (
                                        <>
                                            <span className="text-lg font-bold leading-none">{habit.current}</span>
                                            <span className="text-[10px] opacity-40">/ {habit.goal}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1">
                                <h4 className="font-bold text-lg mb-1 tracking-tight">{habit.name}</h4>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateHabit(habit.id, -1)}
                                        className="text-[10px] text-neutral-500 uppercase hover:text-white transition-colors cursor-pointer"
                                    >
                                        - Remove
                                    </button>
                                    <button
                                        onClick={() => deleteHabit(habit.id)}
                                        className="text-[10px] text-red-500/50 uppercase hover:text-red-500 transition-colors cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {progress >= 100 && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-main text-black p-2 rounded-full">
                                    <Check size={16} />
                                </motion.div>
                            )}
                        </div>
                    );
                })}

                {habits.length === 0 && !isAdding && (
                    <div className="text-center py-12 opacity-30">
                        <Plus className="mx-auto mb-2" size={40} />
                        <p className="text-sm font-medium">Add your first habit</p>
                    </div>
                )}
            </div>
        </div>
    );
}
