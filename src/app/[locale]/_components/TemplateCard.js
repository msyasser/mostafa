"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
export default function TemplateCard({ template, index }) {
  const t = useTranslations("TemplateSlug");
  const locale = useLocale();
  const [isTemplatesSubdomain, setIsTemplatesSubdomain] = useState(false);

  useEffect(() => {
    setIsTemplatesSubdomain(window.location.hostname === "templates.mostafayasser.com");
  }, []);

  const templateHref = isTemplatesSubdomain
    ? `/${locale}/${template.slug}`
    : `/${locale}/templates/${template.slug}`;

  // Fallback function to get template name
  const getTemplateName = () => {
    try {
      return t(`${template.name}.name`);
    } catch (error) {
      return locale === "ar" ? template.name_ar || template.name : template.name;
    }
  };

  // Fallback function to get template image
  const getTemplateImage = () => {
    try {
      return t(`${template.name}.image`);
    } catch (error) {
      return `/thumbnails/${locale === "ar" ? "ARThumbnails" : "ENThumbnails"}/${template.id}.webp`;
    }
  };

  // Fallback function to get template price
  const getTemplatePrice = () => {
    try {
      return t(`${template.name}.price`);
    } catch (error) {
      return template.premium ? "PRO" : "$0";
    }
  };

  const isNewTemplate = () => {
    if (!template.lastUpdated) {
      return false;
    }

    const parsedDate = new Date(template.lastUpdated);
    if (Number.isNaN(parsedDate.getTime())) {
      return false;
    }

    const now = new Date();
    const diffInMs = now - parsedDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays >= 0 && diffInDays <= 30;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-[1.01] hover:-translate-y-2 ease-in-out cursor-pointer hover:shadow-main">
        <Link href={templateHref}>
          {/* Price Label */}
          {template.premium && (
            <span
              className="absolute top-9 right-0 rounded-tl-xl rounded-bl-xl border border-[#D7B180] text-[#D7B180] text-sm font-semibold px-4 py-1 -mr-1"
              suppressHydrationWarning={true}
            >
              PRO
            </span>
          )}
          {isNewTemplate() && (
            <span className="absolute top-4 left-4 rounded-full bg-white text-black text-xs font-semibold px-3 py-1 shadow-md">
              NEW
            </span>
          )}


          <div className="w-full aspect-[4/3] lg:aspect-auto">
            <Image
              src={getTemplateImage()}
              alt={`Template ${getTemplateName()}`}
              width={400}
              height={400}
              className="object-cover w-full h-full"
              priority={index < 6} // Prioritize first 6 images
              loading={index < 6 ? "eager" : "lazy"}
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRnoAAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSDIAAAARL0AmbZurmr57yyIiqE8oiG0bejIYEQTgqiDA9vqnsUSI6H+oAERp2HZ65qP/VIAWAFZQOCBCAAAA8AEAnQEqEAAIAAVAfCWkAALp8sF8rgRgAP7o9FDvMCkMde9PK7euH5M1m6VWoDXf2FkP3BqV0ZYbO6NA/VFIAAAA"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={true}
            />
          </div>
          <h3 className="mt-3 text-base font-semibold sm:text-lg md:text-xl">
            {getTemplateName()}
          </h3>
          <p className="text-[#D7B180] text-lg sm:text-xl md:text-2xl font-bold mb-4 drop-shadow-[0_0_5px_rgba(215,177,128,0.4)]">
            {getTemplatePrice()}
          </p>
        </Link>
      </div>
    </motion.div>
  );
}
