"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaCalendarAlt, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function NotionCalendarButton({
    label = "Book Consultation",
    className = ""
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`inline-flex items-center justify-center gap-2 bg-[#d7b180] text-black font-bold px-6 py-3 rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(215,177,128,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transform hover:-translate-y-1 cursor-pointer ${className}`}
            >
                <FaCalendarAlt className="text-lg" />
                <span>{label}</span>
            </button>

            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />

                            {/* Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-5xl h-[85vh] bg-[#191919] rounded-2xl border border-[#333] shadow-2xl overflow-hidden flex flex-col z-10"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-[#333] bg-[#202020]">
                                    <h3 className="text-white font-bold text-lg">Book a Consultation</h3>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-full transition-colors cursor-pointer"
                                    >
                                        <FaTimes className="text-xl" />
                                    </button>
                                </div>

                                {/* Iframe Container */}
                                <div className="flex-1 bg-white w-full relative">
                                    <iframe
                                        src="https://calendar.notion.so/meet/mostafa-yasser/discovery-call"
                                        className="absolute inset-0 w-full h-full border-0"
                                        title="Notion Calendar Scheduling"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
