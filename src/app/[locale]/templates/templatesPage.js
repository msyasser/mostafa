"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import TemplateList from "@/src/app/[locale]/_components/TemplateList";
import CategoryButtons from "@/src/app/[locale]/_components/CategoryButtons";
import AdvancedFilter from "@/src/app/[locale]/_components/AdvancedFilter";

export default function TemplatesPage() {
  const t = useTranslations("TemplatesPage");
  const searchParams = useSearchParams();
  const filter = searchParams?.get("category");
  const pricingFilter = searchParams?.get("pricing") || "all";
  const [sortOrder, setSortOrder] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const sortOptions = [
    { value: "newest", label: t("sort.newest") },
    { value: "oldest", label: t("sort.oldest") },
  ];

  const activeSortOption = sortOptions.find((option) => option.value === sortOrder);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <BlurText>
      <div className="w-full px-4 sm:px-6 py-8 sm:py-12 mt-4 sm:mt-6 lg:mt-12">
        <section className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6">
            {t("title")}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-main mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 my-4 sm:my-6 max-w-4xl mx-auto">
            <div className="w-full sm:flex-1">
              <CategoryButtons />
            </div>
            <div className="w-full sm:w-auto sm:shrink-0 flex items-center justify-center sm:justify-start gap-2">
              <AdvancedFilter />
              <div className="relative w-full sm:w-auto" ref={sortRef}>
                <button
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  className={`cursor-pointer w-12 h-10 rounded-xl border transition-all duration-300 flex items-center justify-center text-sm sm:text-base ${
                    isSortOpen ? "bg-main text-white border-black" : "bg-black text-main"
                  }`}
                  type="button"
                  title={t("sort.label")}
                >
                  <span className="sr-only">{t("sort.label")}</span>
                  <ArrowUpDown size={16} />
                </button>

                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-2 w-full sm:w-auto min-w-[180px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortOrder(option.value);
                          setIsSortOpen(false);
                        }}
                        className={`cursor-pointer w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 ${
                          sortOrder === option.value ? "bg-main/10 text-main" : "text-gray-700"
                        }`}
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          <TemplateList filter={filter} pricingFilter={pricingFilter} sortOrder={sortOrder} />
        </section>
      </div>
    </BlurText>
  );
}
