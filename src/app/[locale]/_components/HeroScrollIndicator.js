"use client";

import { useTranslations } from "next-intl";
import { BsArrowDown } from "react-icons/bs";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroScrollIndicator() {
  const t = useTranslations("HomePage");
  const { scrollY } = useScroll();

  // Smoothly fades out and shifts down slightly as user scrolls
  const opacity = useTransform(scrollY, [0, 140], [1, 0]);
  const scrollYOffset = useTransform(scrollY, [0, 140], [0, 15]);

  const scrollToNextSection = () => {
    const section = document.getElementById("routing-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      style={{ opacity, y: scrollYOffset }}
      className="mt-12 flex flex-col items-center justify-center relative z-10 select-none"
    >
      <motion.button
        onClick={scrollToNextSection}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        animate={{ y: [0, 6, 0] }}
        transition={{
          y: {
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="group relative flex items-center gap-3.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full 
                   bg-neutral-900/70 hover:bg-neutral-900/90 backdrop-blur-xl 
                   border border-white/15 hover:border-main/50 
                   shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(215,177,128,0.12)] 
                   hover:shadow-[0_8px_32px_rgba(0,0,0,0.7),0_0_30px_rgba(215,177,128,0.35)] 
                   cursor-pointer focus:outline-none transition-all duration-300"
        aria-label={t("findYourFit")}
      >
        {/* Subtle glowing ambient dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-main opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-main" />
        </span>

        {/* Text */}
        <span className="text-sm sm:text-base font-semibold tracking-wide text-neutral-200 group-hover:text-white transition-colors duration-300">
          {t("findYourFit")}
        </span>

        {/* Arrow Badge */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-main/15 group-hover:bg-main text-main group-hover:text-black flex items-center justify-center transition-all duration-300 shadow-[0_0_12px_rgba(215,177,128,0.2)] group-hover:shadow-[0_0_20px_rgba(215,177,128,0.6)]">
          <BsArrowDown className="text-xs sm:text-sm group-hover:translate-y-0.5 transition-transform duration-200" />
        </div>
      </motion.button>
    </motion.div>
  );
}

