import { getTranslations } from "next-intl/server";
import SignInForm from "@/src/app/[locale]/_components/SignInForm";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });

  const isArabic = locale === "ar";

  return {
    title: isArabic ? "تسجيل الدخول" : "Sign In",
    description: t("SIGNIN_DESCRIPTION"),
  };
}

export default async function SignInPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center px-4 sm:px-6 md:px-8 pt-20 sm:pt-20 md:pt-24 lg:pt-28 pb-16 sm:pb-16 md:pb-20 lg:pb-24">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t("SIGN_IN")}</h1>
          <p className="text-gray-400 text-sm sm:text-base">{t("SIGNIN_DESCRIPTION")}</p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}

