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
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("SIGN_IN")}</h1>
          <p className="text-gray-400">{t("SIGNIN_DESCRIPTION")}</p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}

