"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

// The real screenshots inside a small browser window, with arrows and dots when there is more than one
export default function ProjectGallery({ images, title }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="group relative overflow-hidden rounded-[22px] border border-main/20 bg-neutral-900 p-3 shadow-2xl md:p-4">
            <div className="overflow-hidden rounded-xl border border-white/15 bg-black">
                <div className="flex h-7 items-center gap-1.5 border-b border-white/10 bg-neutral-800 px-3" aria-hidden="true">
                    <span className="size-2.5 rounded-full bg-white/25" />
                    <span className="size-2.5 rounded-full bg-white/25" />
                    <span className="size-2.5 rounded-full bg-white/25" />
                </div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Image
                            src={images[currentIndex]}
                            alt={`${title} - ${currentIndex + 1}`}
                            width={1920}
                            height={1080}
                            className="block h-auto w-full"
                            priority
                            unoptimized
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {images.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={prevImage}
                        aria-label="Previous"
                        className="absolute left-6 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-md transition hover:bg-main hover:text-black md:opacity-0 md:group-hover:opacity-100"
                    >
                        <BsChevronLeft size={20} />
                    </button>
                    <button
                        type="button"
                        onClick={nextImage}
                        aria-label="Next"
                        className="absolute right-6 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-md transition hover:bg-main hover:text-black md:opacity-0 md:group-hover:opacity-100"
                    >
                        <BsChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setCurrentIndex(idx)}
                                aria-label={`${idx + 1} / ${images.length}`}
                                className={`h-2 rounded-full transition-all ${idx === currentIndex ? "w-6 bg-main" : "w-2 bg-white/30 hover:bg-white/50"}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
