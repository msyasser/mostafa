"use client";

import { useTranslations } from "next-intl";
import { BsArrowDown } from "react-icons/bs";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroScrollIndicator() {
  const t = useTranslations("HomePage");
  const { scrollY } = useScroll();

  // Fades out as the visitor scrolls past the hero
  const opacity = useTransform(scrollY, [0, 160], [1, 0]);

  const scrollToNextSection = () => {
    const section = document.getElementById("routing-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div style={{ opacity }} className="mt-7 relative z-10 select-none">
      <button
        onClick={scrollToNextSection}
        className="group inline-flex items-center gap-2 border-b-2 border-main pb-1 text-main text-sm sm:text-base font-semibold uppercase tracking-[0.14em] rtl:tracking-normal rtl:normal-case cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main"
        aria-label={t("findYourFit")}
      >
        <span>{t("findYourFit")}</span>
        <BsArrowDown className="text-sm transition-transform duration-200 group-hover:translate-y-0.5" />
      </button>
    </motion.div>
  );
}
