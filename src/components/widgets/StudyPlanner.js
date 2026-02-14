"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, Plus, Trash2, CheckCircle2, Circle, Settings } from "lucide-react";

export default function StudyPlanner({ theme = "dark", isPreview = false, isExplorer = false }) {
    const t = useTranslations("StudyPlanner");
    const locale = useLocale();
    const isDark = theme === "dark";

    const [topics, setTopics] = useState([]);
    const [newTopic, setNewTopic] = useState("");
    const [studyHours, setStudyHours] = useState(0);

    useEffect(() => {
        if (isPreview) {
            setTopics([
                { id: 1, text: "Math - Calculus", completed: true },
                { id: 2, text: "Physics - Newton's Laws", completed: false },
                { id: 3, text: "CS - Data Structures", completed: false }
            ]);
            setStudyHours(12);
            return;
        }

        const savedTopics = localStorage.getItem("studyPlannerTopics");
        const savedHours = localStorage.getItem("studyPlannerHours");

        if (savedTopics) setTopics(JSON.parse(savedTopics));
        if (savedHours) setStudyHours(parseFloat(savedHours));
    }, [isPreview]);

    useEffect(() => {
        if (!isPreview) {
            localStorage.setItem("studyPlannerTopics", JSON.stringify(topics));
            localStorage.setItem("studyPlannerHours", studyHours.toString());
        }
    }, [topics, studyHours, isPreview]);

    const addTopic = () => {
        if (!newTopic.trim()) return;
        const topic = {
            id: Date.now(),
            text: newTopic.trim(),
            completed: false
        };
        setTopics([...topics, topic]);
        setNewTopic("");
    };

    const toggleTopic = (id) => {
        setTopics(topics.map(topic =>
            topic.id === id ? { ...topic, completed: !topic.completed } : topic
        ));
    };

    const removeTopic = (id) => {
        setTopics(topics.filter(topic => topic.id !== id));
    };

    const progress = topics.length > 0
        ? Math.round((topics.filter(t => t.completed).length / topics.length) * 100)
        : 0;

    const containerClasses = isDark
        ? "bg-neutral-900/80 border-neutral-800 text-white"
        : "bg-white/80 border-gray-200 text-black";

    if (isPreview) {
        return (
            <div className={`relative overflow-hidden rounded-2xl border p-4 w-full scale-90 origin-top shadow-lg ${containerClasses}`}>
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-bold uppercase tracking-tighter">Study Planner</h4>
                    <span className="text-main text-xs font-bold">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-black/20 rounded-full mb-3 overflow-hidden">
                    <div className="h-full bg-main transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="space-y-1.5 opacity-60">
                    {topics.slice(0, 2).map((topic) => (
                        <div key={topic.id} className="flex items-center gap-2 text-[10px]">
                            {topic.completed ? <CheckCircle2 size={10} className="text-main" /> : <Circle size={10} />}
                            <span className="truncate">{topic.text}</span>
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
                            onClick={() => window.open(`/${locale}/tools/study-planner`, '_blank')}
                            className="absolute right-0 top-0 p-2 hover:bg-neutral-800/50 rounded-xl transition-colors text-neutral-500 hover:text-white cursor-pointer"
                        >
                            <Settings size={18} />
                        </button>
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter uppercase leading-none">{t("title")}</h3>
                    <div className="mt-4 flex items-center justify-center gap-8">
                        <div className="text-center">
                            <span className="block text-2xl font-black">{studyHours}</span>
                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold font-mono">{t("hours")}</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-2xl font-black text-main">{progress}%</span>
                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold font-mono">{t("completed")}</span>
                        </div>
                    </div>
                </div>

                <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-main shadow-[0_0_15px_rgba(var(--main-rgb),0.5)]"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTopic()}
                            placeholder={t("addTopicPlaceholder")}
                            className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-main/50 transition-all ${isDark ? "bg-neutral-800 border-neutral-700" : "bg-gray-100 border-gray-200"}`}
                        />
                        <button onClick={addTopic} className="bg-main text-black p-3 rounded-xl hover:scale-105 active:scale-95 transition-all">
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                        {topics.length === 0 ? (
                            <p className="text-center text-neutral-500 text-sm py-4 italic">{t("noTopics")}</p>
                        ) : (
                            <AnimatePresence>
                                {topics.map((topic) => (
                                    <motion.div
                                        key={topic.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className={`flex items-center justify-between p-3 rounded-xl border ${topic.completed ? (isDark ? "bg-main/5 border-main/20" : "bg-main/5 border-main/30") : (isDark ? "bg-neutral-800/50 border-neutral-700/50" : "bg-gray-50 border-gray-100")}`}
                                    >
                                        <div
                                            className="flex items-center gap-3 cursor-pointer flex-1"
                                            onClick={() => toggleTopic(topic.id)}
                                        >
                                            {topic.completed ? (
                                                <CheckCircle2 size={18} className="text-main" />
                                            ) : (
                                                <Circle size={18} className="text-neutral-500" />
                                            )}
                                            <span className={`text-sm font-medium ${topic.completed ? "line-through text-neutral-500" : ""}`}>
                                                {topic.text}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => removeTopic(topic.id)}
                                            className="text-neutral-600 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t border-neutral-800/50 flex items-center justify-between mt-auto">
                    <span className="text-xs text-neutral-500 font-bold uppercase tracking-widest font-mono">{t("studyTime")}</span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setStudyHours(Math.max(0, studyHours - 0.5))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-800 hover:bg-neutral-800 transition-colors text-white"
                        >-</button>
                        <span className="font-bold w-12 text-center text-white">{studyHours}h</span>
                        <button
                            onClick={() => setStudyHours(studyHours + 0.5)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-800 hover:bg-neutral-800 transition-colors text-white"
                        >+</button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
