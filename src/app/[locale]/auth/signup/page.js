import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import SignUpForm from "@/src/app/[locale]/_components/SignUpForm";
import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });
  const isArabic = locale === "ar";

  return {
    title: isArabic ? "إنشاء حساب | مصطفى ياسر" : "Sign Up | Mostafa Yasser",
    description: t("SIGNUP_DESCRIPTION"),
  };
}

export default async function SignUpPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-24 sm:py-28 overflow-hidden bg-neutral-950">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-main/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-neutral-800/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full mx-auto">
        <AnimatedWrapper>
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2.5">
              {t("SIGN_UP")}
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
              {t("SIGNUP_DESCRIPTION")}
            </p>
          </div>
        </AnimatedWrapper>

        <Suspense fallback={<div className="h-96 rounded-3xl bg-neutral-900/40 animate-pulse border border-neutral-800" />}>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  );
}
