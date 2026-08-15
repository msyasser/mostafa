import { useTranslations } from "next-intl";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const title = isArabic
    ? "سياسة الخصوصية"
    : "Privacy Policy";

  const description = isArabic
    ? "افهم كيف يجمع مصطفى ياسر بياناتك الشخصية ويستخدمها ويحميها."
    : "Understand how Mostafa Yasser collects, uses, and protects your personal data.";

  return {
    title,
    description,
    openGraph: {
      title,
      description: isArabic
        ? "تعرف على كيفية التعامل مع بياناتك وضمان خصوصيتك أثناء استخدام خدماتنا."
        : "Learn how we handle your data and ensure your privacy while using our services.",
      url: "https://mostafayasser.com/privacy-policy",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function PrivacyPolicy() {
  const t = useTranslations("PrivacyPage");

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pt-16">
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl shadow-xl max-w-3xl w-full p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-main mb-2">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-400">{t("effectiveDate")}</p>
        </div>

        {[1, 2, 3, 4, 5, 6].map((section) => (
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
            {t("contact.text")}{" "}
            <a
              href="mailto:contactmostafayasser@gmail.com"
              className="text-main hover:text-white transition-colors font-bold text-lg"
            >
              contactmostafayasser@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
