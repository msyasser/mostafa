import { useTranslations } from "next-intl";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? "الشروط والأحكام"
      : "Terms and Conditions",
    description: isArabic
      ? "اقرأ الشروط والأحكام الخاصة باستخدام موقع مصطفى ياسر، بما في ذلك حقوق الاستخدام والمسؤوليات وحدود المسؤولية."
      : "Read the Terms and Conditions for using the Mostafa Yasser website, including usage rights, responsibilities, and limitations of liability.",
    openGraph: {
      title: isArabic
        ? "الشروط والأحكام"
        : "Terms and Conditions",
      description: isArabic
        ? "راجع الشروط المتعلقة باستخدام خدمات وموقع مصطفى ياسر."
        : "Review the terms of using Mostafa Yasser’s services and website.",
      url: "https://mostafayasser.com/terms-of-service",
      type: "website",
    },
  };
}

function TermsOfService() {
  const t = useTranslations("TermsPage");

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pt-16">
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl shadow-xl max-w-3xl w-full p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-main mb-2">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-400">{t("effectiveDate")}</p>
        </div>

        {[1, 2, 3, 4, 5, 6, 7].map((section) => (
          <section key={section}>
            <h2 className="text-xl font-semibold text-main mb-2">
              {t(`section${section}.title`)}
            </h2>
            {Array.isArray(t.raw(`section${section}.content`)) ? (
              <ul className="list-disc list-inside text-gray-200 space-y-1">
                {t.raw(`section${section}.content`).map((item, idx) => (
                  <li key={idx}>
                    {typeof item === "string" ? (
                      item
                    ) : (
                      <>
                        <strong className="text-white">{item.label}</strong>{" "}
                        {item.value}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-300">{t(`section${section}.content`)}</p>
            )}
          </section>
        ))}

        <section>
          <h2 className="text-xl font-semibold text-main mb-2">
            {t("contact.title")}
          </h2>
          <p className="text-gray-300">
            <a
              href="mailto:contactmostafayasser@gmail.com"
              className="text-main underline hover:text-white transition-colors"
            >
              {t("contact.text")}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

export default TermsOfService;
