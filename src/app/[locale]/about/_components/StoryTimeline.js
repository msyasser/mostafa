"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import AnimatedInView from "@/src/app/[locale]/_components/AnimatedInView";

/* ==========================================
   LAYOUT 1: THE SCRAPBOOK (Organic & Layered)
   ========================================== */
const ScrapbookLayout = ({ chapter, index }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
    const yMain = useTransform(scrollYProgress, [0, 1], [0, -80]);
    const ySub = useTransform(scrollYProgress, [0, 1], [0, 40]);
    const isEven = index % 2 === 0;

    return (
        <div ref={containerRef} className="relative py-32 overflow-visible">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
                <div className={`md:col-span-6 ${!isEven ? "md:order-2" : ""}`}>
                    <AnimatedInView threshold={0.2} className="relative z-20">
                        <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 p-8 md:p-12 rounded-sm shadow-2xl relative">
                            <div className="absolute top-0 right-0 w-12 h-12 bg-main/10 rounded-bl-3xl border-b border-l border-main/20"></div>
                            <span className="text-main font-mono text-xs tracking-widest uppercase mb-4 block">0{index + 1} — {chapter.date}</span>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{chapter.title}</h2>
                            <p className="text-neutral-400 text-lg leading-relaxed font-light">
                                {chapter.content.join(' ')}
                            </p>
                        </div>
                    </AnimatedInView>
                </div>
                <div className={`md:col-span-6 relative h-[500px] ${!isEven ? "md:order-1" : ""}`}>
                    <motion.div style={{ y: yMain, rotate: isEven ? -2 : 2 }} className="absolute inset-0 z-10 border-8 border-neutral-900 shadow-2xl overflow-hidden rounded-sm">
                        <Image src={chapter.image || "/about/01.webp"} alt="" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    </motion.div>
                    <motion.div style={{ y: ySub, rotate: isEven ? 5 : -5 }} className={`absolute w-1/2 h-1/2 bg-neutral-800 border-4 border-neutral-700 z-20 shadow-xl overflow-hidden hidden md:block ${isEven ? "-bottom-10 -left-10" : "-top-10 -right-10"}`}>
                        <Image src={chapter.image2 || chapter.image || "/about/01.webp"} alt="" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

/* ==========================================
   LAYOUT 2: THE STAGE (Cinematic & Immersive)
   ========================================== */
const StageLayout = ({ chapter, index }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
    const scale = useTransform(scrollYProgress, [0, 0.5], [1.2, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [0, 1, 1]);

    return (
        <div ref={containerRef} className="relative h-[80vh] flex items-center justify-center overflow-hidden">
            <motion.div style={{ scale, opacity }} className="absolute inset-0 z-0">
                <Image src={chapter.image || "/about/01.webp"} alt="" fill className="object-cover opacity-30 grayscale saturate-0" />
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950"></div>
                <div className="absolute inset-0 bg-neutral-950/40"></div>
            </motion.div>
            <div className="container mx-auto px-6 relative z-10 text-center">
                <AnimatedInView>
                    <span className="text-main font-mono text-sm tracking-[0.5em] uppercase mb-6 block drop-shadow-lg">Phase {index + 1}</span>
                    <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase italic outline-text">{chapter.title}</h2>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-neutral-200 text-xl md:text-2xl leading-relaxed italic font-extralight drop-shadow-md">
                            {chapter.content.join(' ')}
                        </p>
                    </div>
                </AnimatedInView>
            </div>
        </div>
    );
};

/* ==========================================
   LAYOUT 3: THE GRID (Messy clusters)
   ========================================== */
const GridLayout = ({ chapter, index }) => {
    return (
        <div className="relative py-32 container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                {/* Images Cluster */}
                <div className="md:col-span-7 grid grid-cols-2 gap-4 relative h-[600px]">
                    <AnimatedInView className="h-2/3 mt-12">
                        <div className="h-full relative border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                            <Image src={chapter.image || "/about/01.webp"} fill className="object-cover opacity-60 hover:opacity-100 transition-opacity" alt="" />
                        </div>
                    </AnimatedInView>
                    <AnimatedInView delay={0.2} className="h-2/3">
                        <div className="h-full relative border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl -rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Image src={chapter.image2 || chapter.image || "/about/01.webp"} fill className="object-cover opacity-40 hover:opacity-100 transition-opacity" alt="" />
                        </div>
                    </AnimatedInView>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-48 h-48 bg-main rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
                </div>
                {/* Text Content */}
                <div className="md:col-span-5 pt-12">
                    <AnimatedInView threshold={0.5}>
                        <div className="relative pl-12">
                            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-neutral-800">
                                <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: "100%" }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    className="w-full bg-main"
                                />
                            </div>
                            <span className="text-neutral-500 font-mono text-xs uppercase tracking-widest mb-4 block">{chapter.date}</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">{chapter.title}</h2>
                            <div className="text-neutral-400 text-lg font-light leading-relaxed">
                                {chapter.content.join(' ')}
                            </div>
                        </div>
                    </AnimatedInView>
                </div>
            </div>
        </div>
    );
};

/* ==========================================
   LAYOUT 4: THE SCHEMATIC (Blueprint feel)
   ========================================== */
const SchematicLayout = ({ chapter, index }) => {
    return (
        <div className="relative py-32 bg-neutral-900/20 border-y border-neutral-800/30">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 order-2 md:order-1">
                        <AnimatedInView>
                            <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-main/40 uppercase mb-8">
                                <span>Status: Verified</span> <span>Link: Secure</span>
                                <span>Ref: SYS_{index + 200}</span> <span>Ver: 1.0.{index}</span>
                            </div>
                            <h2 className="text-3xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter outline-text-main">{chapter.title}</h2>
                            <div className="h-px w-24 bg-main mb-8"></div>
                            <div className="text-neutral-400 text-lg leading-relaxed border-l-2 border-neutral-800 pl-6">
                                {chapter.content.join(' ')}
                            </div>
                        </AnimatedInView>
                    </div>
                    <div className="flex-1 order-1 md:order-2 relative aspect-square">
                        <AnimatedInView className="w-full h-full p-4 border border-main/20 rounded-full relative group">
                            <div className="absolute inset-0 border-[40px] border-neutral-900 rounded-full z-0 group-hover:border-[20px] transition-all duration-700"></div>
                            <div className="w-full h-full rounded-full overflow-hidden relative z-10 border border-neutral-800">
                                <Image src={chapter.image || "/about/01.webp"} fill className="object-cover grayscale" alt="" />
                                <div className="absolute inset-0 bg-main/20 mix-blend-overlay"></div>
                            </div>

                            {/* Satellite Image (Image 2) */}
                            {chapter.image2 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full border-4 border-neutral-900 bg-neutral-800 overflow-hidden z-20 shadow-2xl"
                                >
                                    <Image src={chapter.image2} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" alt="" />
                                </motion.div>
                            )}

                            {/* Moving decorative circle */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-[-20px] border-[2px] border-dashed border-main/30 rounded-full"
                            />
                        </AnimatedInView>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function StoryTimeline() {
    const t = useTranslations("AboutPage.story");
    const chapters = t.raw("chapters");

    // Cycle through 4 distinct layouts
    const renderLayout = (chapter, index) => {
        const layoutType = index % 4;
        switch (layoutType) {
            case 0: return <ScrapbookLayout key={index} chapter={chapter} index={index} />;
            case 1: return <StageLayout key={index} chapter={chapter} index={index} />;
            case 2: return <GridLayout key={index} chapter={chapter} index={index} />;
            case 3: return <SchematicLayout key={index} chapter={chapter} index={index} />;
            default: return <ScrapbookLayout key={index} chapter={chapter} index={index} />;
        }
    };

    return (
        <section className="relative bg-neutral-950 overflow-hidden selection:bg-main selection:text-black">
            {/* Background Texture/Grid */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:60px_60px]"></div>
            </div>

            {/* Introductory Heading */}
            <div className="container mx-auto px-6 pt-24 pb-20 text-center relative z-10">
                <AnimatedInView>
                    <div className="flex justify-center items-center gap-4 mb-8">
                        <div className="h-px w-12 bg-neutral-800"></div>
                        <span className="text-main text-[10px] font-mono uppercase tracking-[0.5em]">{t("badge")}</span>
                        <div className="h-px w-12 bg-neutral-800"></div>
                    </div>
                    <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none mb-12">
                        {t("titleLine1") && <>{t("titleLine1")} <br /></>} <span className="text-main">{t("titleLine2")}</span>
                    </h2>
                </AnimatedInView>
            </div>

            {/* Content Sections */}
            <div className="relative">
                {chapters.map((chapter, index) => renderLayout(chapter, index))}
            </div>

            {/* Custom Global CSS for outlined text */}
            <style jsx global>{`
                .outline-text {
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
                }
                .outline-text-main {
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(215, 177, 128, 0.5);
                }
            `}</style>
        </section>
    );
}
