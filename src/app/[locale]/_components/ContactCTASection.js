"use client";

import { useTranslations, useLocale } from "next-intl";
import { BsShieldCheck } from "react-icons/bs";
import AnimatedInView from "./AnimatedInView";
import SubscriptionForm from "./SubscriptionForm";

export default function ContactCTASection() {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <section className="w-full py-16 px-4 md:px-8 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-main/5 blur-[120px] -z-10 rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <AnimatedInView threshold={0.1}>
          <div className="relative rounded-3xl bg-neutral-900/80 border border-neutral-800/80 p-8 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Simple & Concise Value Prop */}
              <div className="lg:col-span-6 text-start">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-3 tracking-tight">
                  {t("newsletterCtaTitle")}
                </h2>

                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-6 font-light">
                  {t("newsletterCtaDesc")}
                </p>

                <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                  <BsShieldCheck className="text-main text-sm" />
                  <span>{t("newsletterNoSpam")}</span>
                </div>
              </div>

              {/* Right Column: Name & Email Form */}
              <div className="lg:col-span-6 w-full">
                <SubscriptionForm
                  includeName={true}
                  buttonText={isArabic ? "اشترك مجاناً" : "Subscribe for Free"}
                  className="flex flex-col gap-3 w-full"
                />
              </div>

            </div>

          </div>
        </AnimatedInView>
      </div>
    </section>
  );
}
