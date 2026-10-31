"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import AnimatedInView from "./AnimatedInView";
import { CREDLY_BADGE_URL } from "../_data/credentials";

export default function HomeAboutSection() {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const ArrowIcon = isArabic ? BsArrowLeft : BsArrowRight;

  const highlights = isArabic
    ? [
        "استشاري معتمد رسمياً من نوشن (Notion Certified Consultant)",
        "صانع قوالب مميّز على متجر نوشن",
        "مهندس أنظمة رقمية ومؤسس مجتمع عرب نوشن",
      ]
    : [
        "Official Notion Certified Consultant",
        "Official Featured Notion Creator",
        "Digital Systems Architect & Founder of Notion Arabs",
      ];

  return (
    <section className="w-full pt-28 pb-10 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-14 lg:gap-16 items-center">
          {/* Portrait with the Notion consulting partner badge */}
          <AnimatedInView threshold={0.1} className="w-full max-w-md mx-auto lg:mx-0">
            <div className="relative">
              <div className="overflow-hidden rounded-md border border-main bg-black">
                <Image
                  src="/about/mostafa-portrait.webp"
                  alt="Mostafa Yasser"
                  width={800}
                  height={880}
                  className="w-full aspect-[1/1.1] object-cover"
                  unoptimized={true}
                />
              </div>
              <a
                href={CREDLY_BADGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={isArabic ? "تحقق من الاعتماد على Credly" : "Verify this credential on Credly"}
                className="absolute -bottom-6 -start-6 transition-transform duration-200 hover:scale-105"
              >
                <Image
                  src="/badges/notion-consulting-partner.webp"
                  alt={isArabic ? "شريك استشارات نوشن" : "Notion Consulting Partner"}
                  width={272}
                  height={480}
                  className="h-28 w-auto drop-shadow-[0_10px_18px_rgba(0,0,0,0.8)]"
                  unoptimized={true}
                />
              </a>
            </div>
          </AnimatedInView>

          {/* Narrative */}
          <div className="flex flex-col justify-center">
            <AnimatedInView threshold={0.1}>
              <p className="text-main text-xs sm:text-sm tracking-[0.22em] rtl:tracking-normal uppercase mb-3">
                {t("aboutMeTitle")}
              </p>
              <h2 className="text-3xl sm:text-5xl font-semibold uppercase rtl:normal-case rtl:font-extrabold text-white leading-[1.05] rtl:leading-[1.3] mb-5">
                {t("aboutTitle")}
              </h2>
            </AnimatedInView>

            <AnimatedInView threshold={0.1}>
              <p className="text-neutral-300 text-lg sm:text-xl leading-relaxed">{t("aboutDescription")}</p>
            </AnimatedInView>

            <ul className="mt-6 mb-8 border-t border-[#3a3027]">
              {highlights.map((point, index) => (
                <li key={index} className="flex items-baseline gap-3.5 py-3 border-b border-neutral-800 text-base sm:text-lg text-neutral-200">
                  <span aria-hidden="true" className="w-2 h-2 bg-main shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div>
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full border-[1.5px] border-[#3a3027] text-[#F4D9B6] font-semibold uppercase tracking-[0.06em] rtl:tracking-normal rtl:normal-case hover:border-main hover:text-main transition-colors group"
              >
                <span>{t("aboutBtn")}</span>
                <ArrowIcon className="text-lg transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
