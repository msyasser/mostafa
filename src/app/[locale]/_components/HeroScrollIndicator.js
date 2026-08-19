"use client";

import { useTranslations } from "next-intl";
import { BsArrowDown } from "react-icons/bs";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroScrollIndicator() {
  const t = useTranslations("HomePage");
  const { scrollY } = useScroll();

  // Smoothly fades out and shifts down slightly as user scrolls
  const opacity = useTransform(scrollY, [0, 140], [1, 0]);
  const y = useTransform(scrollY, [0, 140], [0, 15]);

  const scrollToNextSection = () => {
    const section = document.getElementById("routing-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      style={{ opacity, y }}
      className="mt-12 flex flex-col items-center justify-center relative z-10 select-none"
    >
      <button
        onClick={scrollToNextSection}
        className="group flex flex-col items-center gap-3 cursor-pointer focus:outline-none transition-all duration-300"
        aria-label={t("findYourFit")}
      >
        <span className="text-sm sm:text-base md:text-lg font-semibold tracking-wide text-main group-hover:text-white transition-colors duration-300">
          {t("findYourFit")}
        </span>

        <div className="w-10 h-10 rounded-full border border-main/40 group-hover:border-main bg-main/10 group-hover:bg-main group-hover:text-black backdrop-blur-sm flex items-center justify-center text-main shadow-[0_0_20px_rgba(215,177,128,0.25)] group-hover:shadow-[0_0_30px_rgba(215,177,128,0.5)] transition-all duration-300 animate-bounce">
          <BsArrowDown className="text-base group-hover:translate-y-0.5 transition-transform duration-200" />
        </div>
      </button>
    </motion.div>
  );
}
