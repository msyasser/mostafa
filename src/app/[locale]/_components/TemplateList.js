"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Fuse from "fuse.js";
import { Suspense } from "react";
import { Search } from "lucide-react";
import Loader from "@/src/app/[locale]/_components/Loader";
import templatesData from "@/src/app/[locale]/_data/templatesData";
import TemplateCard from "./TemplateCard";
import { useTranslations, useLocale } from "next-intl";

function TemplateList({ filter, pricingFilter, sortOrder = "newest" }) {
  const t = useTranslations("TemplatesPage");
  const locale = useLocale();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isTemplatesSubdomain, setIsTemplatesSubdomain] = useState(false);

  useEffect(() => {
    setIsTemplatesSubdomain(window.location.hostname === "templates.mostafayasser.com");
  }, []);

  // First filter by category
  let filteredTemplates =
    !filter || filter === "all"
      ? templatesData
      : templatesData.filter((template) => template.category === filter);

  // Then filter by pricing
  if (pricingFilter && pricingFilter !== "all") {
    filteredTemplates = filteredTemplates.filter((template) => {
      if (pricingFilter === "free") {
        return !template.premium; // Free templates don't have premium: true
      } else if (pricingFilter === "premium") {
        return template.premium === true; // Premium templates have premium: true
      }
      return true;
    });
  }

  const fuse = new Fuse(filteredTemplates, {
    keys: locale === "ar" ? ["name_ar", "tags_ar"] : ["name", "tags"],
    threshold: 0.4,
  });

  const searchedTemplates =
    searchTerm.trim() === ""
      ? filteredTemplates
      : fuse.search(searchTerm).map((result) => result.item);

  const sortedTemplates = [...searchedTemplates].sort((a, b) => {
    const aDate = new Date(a.lastUpdated || 0).getTime();
    const bDate = new Date(b.lastUpdated || 0).getTime();
    return sortOrder === "oldest" ? aDate - bDate : bDate - aDate;
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-6 sm:mt-8 flex justify-center px-4 sm:px-6"
      >
        <motion.div
          animate={{
            width: isFocused ? "100%" : "100%",
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative w-full max-w-sm sm:max-w-md"
        >
          <input
            type="text"
            placeholder={t("placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-main transition-all duration-300 text-sm sm:text-base"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </motion.div>
      </motion.div>

      <Suspense fallback={<Loader />} key={filter + searchTerm + pricingFilter + sortOrder}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mt-8 sm:mt-10 px-4 sm:px-0"
        >
          {sortedTemplates.length > 0 ? (
            sortedTemplates.map((template, index) => {
              return (
                <TemplateCard
                  key={template.id}
                  template={template}
                  index={index}
                  isTemplatesSubdomain={isTemplatesSubdomain}
                />
              );
            })
          ) : (
            <p className="col-span-full text-center text-gray-500 mt-10 text-sm">
              {t("noTemplates")}
            </p>
          )}
        </motion.div>
      </Suspense>
    </>
  );
}

export default TemplateList;
