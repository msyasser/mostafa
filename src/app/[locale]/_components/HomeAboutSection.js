"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { BsArrowRight, BsArrowLeft, BsPatchCheckFill, BsAward, BsCheckCircle } from "react-icons/bs";
import AnimatedWrapper from "./AnimatedWrapper";
import AnimatedInView from "./AnimatedInView";

export default function HomeAboutSection() {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const ArrowIcon = isArabic ? BsArrowLeft : BsArrowRight;

  const certImages = [
    { src: "/about/certifications/2.webp", alt: "Notion Essentials" },
    { src: "/about/certifications/3.webp", alt: "Notion Workflows" },
    { src: "/about/certifications/4.webp", alt: "Notion Advanced" },
    { src: "/about/certifications/5.webp", alt: "Notion Certified Admin" },
    { src: "/about/certifications/6.webp", alt: "Notion Consulting Partner" },
    { src: "/about/certifications/7.webp", alt: "Notion Academy AI" },
  ];

  const highlights = isArabic
    ? [
        "استشاري معتمد رسمياً من نوشن (Notion Certified Consultant)",
        "صانع قوالب ومحتوى معتمد ومميز (Featured Creator)",
        "مهندس أنظمة رقمية ومؤسس مجتمع Notion Arabs",
      ]
    : [
        "Official Notion Certified Consultant",
        "Official Featured Notion Creator",
        "Digital Systems Architect & Founder of Notion Arabs",
      ];

  return (
    <section className="w-full py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-main/5 blur-[120px] -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visuals & Certs */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <AnimatedInView threshold={0.1} className="w-full max-w-md">
              <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/90 p-3 shadow-2xl group">
                <div className="relative w-full aspect-[4/5] min-h-[380px] rounded-2xl overflow-hidden bg-neutral-950">
                  <Image
                    src="/about/posts-images.webp"
                    alt="Mostafa Yasser"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    unoptimized={true}
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                  
                  {/* Floating badge */}
                  <div className="absolute bottom-4 inset-x-4 p-4 rounded-xl bg-neutral-900/90 border border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-main/20 flex items-center justify-center text-main">
                        <BsPatchCheckFill className="text-xl" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Mostafa Yasser</h4>
                        <p className="text-neutral-400 text-xs">{t("aboutBadge")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedInView>

            {/* Certifications preview */}
            <div className="w-full max-w-md mt-6">
              <p className="text-xs text-neutral-400 font-mono text-center mb-3 uppercase tracking-wider">
                {t("officialCerts")}
              </p>
              <div className="grid grid-cols-6 gap-2 bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800/80">
                {certImages.map((cert, index) => (
                  <div key={index} className="relative h-12 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
                    <Image
                      src={cert.src}
                      alt={cert.alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Stats */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <AnimatedInView threshold={0.1}>
              <span className="px-4 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 text-main text-xs sm:text-sm font-mono tracking-widest uppercase mb-4 inline-block backdrop-blur-md">
                {t("aboutMeTitle")}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                {t("aboutTitle")}
              </h2>
            </AnimatedInView>

            <AnimatedInView threshold={0.1}>
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed mb-6 font-light">
                {t("aboutDescription")}
              </p>
            </AnimatedInView>

            {/* Bullet Points */}
            <div className="space-y-3 mb-8">
              {highlights.map((point, index) => (
                <AnimatedWrapper key={index} delay={index * 0.1}>
                  <div className="flex items-start gap-3 text-sm sm:text-base text-neutral-300">
                    <BsCheckCircle className="text-main text-lg shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                </AnimatedWrapper>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-neutral-800/80 mb-8">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-main">100K+</div>
                <div className="text-xs sm:text-sm text-neutral-400 mt-1">{t("statDownloads")}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-main">#1</div>
                <div className="text-xs sm:text-sm text-neutral-400 mt-1">{t("statRank")}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-main">7+</div>
                <div className="text-xs sm:text-sm text-neutral-400 mt-1">{t("statExperience")}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-main">50+</div>
                <div className="text-xs sm:text-sm text-neutral-400 mt-1">{t("statSystems")}</div>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-neutral-800 hover:bg-main hover:text-black text-white font-semibold text-base transition-all duration-300 shadow-md group"
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
