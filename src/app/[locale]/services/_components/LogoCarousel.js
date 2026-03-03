"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale } from "next-intl";

const logos = [
    "/Clients/Clients Logos.webp",
    "/Clients/Resaltk.webp",
    "/Clients/Shoiep Studio.webp",
    "/Clients/Notion Arabs.webp",
];

export default function LogoCarousel() {
    const locale = useLocale();
    const isArabic = locale === "ar";

    // Duplicate logos for infinite loop effect
    const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

    return (
        <div className="w-full py-12 bg-neutral-950 border-y border-neutral-900 overflow-hidden relative">
            <div className="container mx-auto px-6 mb-8 text-center">
                <span className="text-neutral-500 font-mono text-xs tracking-[0.3em] uppercase">
                    {isArabic ? "موثوق به من قبل" : "Trusted By Global Teams"}
                </span>
            </div>

            <div className="relative flex overflow-hidden group">
                <motion.div
                    className="flex whitespace-nowrap gap-16 md:gap-32 items-center"
                    animate={{
                        x: isArabic ? ["0%", "50%"] : ["-50%", "0%"],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {duplicatedLogos.map((logo, index) => (
                        <div
                            key={index}
                            className="relative w-32 h-12 md:w-48 md:h-16 flex-shrink-0"
                        >
                            <Image
                                src={logo}
                                alt="Client Logo"
                                fill
                                className="object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                            />
                        </div>
                    ))}
                </motion.div>

                {/* Gradient Overlays for smooth edges */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none"></div>
            </div>
        </div>
    );
}
