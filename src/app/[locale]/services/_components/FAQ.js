"use client";

import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BsPlus, BsDash } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
    const t = useTranslations("ServicesPage.faq");
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-neutral-900 border-t border-neutral-800">
            <div className="max-w-4xl mx-auto px-6 lg:px-12">
                <AnimatedWrapper>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-16 text-center">
                        {t("title")}
                    </h2>
                </AnimatedWrapper>

                <div className="space-y-4">
                    {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-800/20 hover:border-neutral-700 transition-colors cursor-pointer">
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-main cursor-pointer"
                            >
                                <span className="text-lg md:text-xl font-medium text-white group-hover:text-main transition-colors">
                                    {t(`items.${index}.question`)}
                                </span>
                                <span className="ml-4 flex-shrink-0 text-neutral-400">
                                    {activeIndex === index ? <BsDash size={24} /> : <BsPlus size={24} />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 text-neutral-400 leading-relaxed font-light">
                                            {t(`items.${index}.answer`)}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
