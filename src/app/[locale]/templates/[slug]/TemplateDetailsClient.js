import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import AnimatedInView from "@/src/app/[locale]/_components/AnimatedInView";
import PremiumPage from "./PremiumPage";
import CheckoutButton from "../../_components/CheckoutButton";
import TemplateCard from "../../_components/TemplateCard";
import SEOOptimizer from "../../_components/SEOOptimizer";
import Link from "next/link";
import templatesData from "@/src/app/[locale]/_data/templatesData";
import enMessages from "@/messages/en/TemplateSlug.json";
import arMessages from "@/messages/ar/TemplateSlug.json";

function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function TemplateDetailsClient({ template }) {
  const t = useTranslations("TemplateSlug");
  const locale = useLocale();

  if (
    template.slug === "study-hub" ||
    template.slug === "second-brain" ||
    template.slug === "finance-hub"
  ) {
    return <PremiumPage template={template} />;
  }

  // 🔍 Step 1: Filter related templates by category or tags
  const relatedTemplates = templatesData.filter((t) => {
    const sameCategory = t.category === template.category;
    const notSameTemplate = t.slug !== template.slug;
    return sameCategory && notSameTemplate;
  });

  // 🔀 Step 2: Pick 3 random related templates
  const recommendations = getRandomItems(relatedTemplates, 3);

  return (
    <>
      <SEOOptimizer
        type="template"
        title={t(`${template.name}.name`)}
        description={t(`${template.name}.description`)}
        url={`https://www.mostafayasser.com/${locale}/templates/${template.slug}`}
        image={t(`${template.name}.image`)}
        locale={locale}
        templateData={{
          name: t(`${template.name}.name`),
          description: t(`${template.name}.description`),
          price: t(`${template.name}.price`)
        }}
      />
      <BlurText>
        <AnimatedInView>
          <div className="min-h-screen px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row lg:gap-10 gap-5 items-start">
            <Image
              src={t(`${template.name}.image`)}
              alt={t(`${template.name}.name`)}
              width={800}
              height={600}
              className="w-full lg:w-7/12 aspect-[4/3] lg:aspect-auto rounded-xl shadow-lg"
              priority={true}
              unoptimized={true}
            />
            <div className="w-full lg:w-1/3 flex flex-col justify-start items-center lg:items-start text-center lg:text-left">
              <h1
                className={`text-2xl md:text-4xl font-bold mb-1 text-center ${locale === "ar" ? "lg:text-right" : "lg:text-left"
                  }`}
              >
                {t(`${template.name}.name`)}
              </h1>
              <p
                className={`text-xl md:text-2xl mt-2 text-main text-center ${locale === "ar" ? "lg:text-right" : "lg:text-left"
                  }`}
              >
                {t(`${template.name}.price`)}
              </p>
              <p
                className={`text-base md:text-lg text-muted mt-4 text-center ${locale === "ar" ? "lg:text-right" : "lg:text-left"
                  }`}
              >
                {t(`${template.name}.description`)}
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start items-center mt-8 gap-4">
                {t(`${template.name}.price`) !== "soon" && (
                  <CheckoutButton
                    checkoutLink={t(`${template.name}.checkoutLink`)}
                    checkoutText={t(`${template.name}.checkout`)}
                    arabicCheckoutLink={arMessages[template.name]?.checkoutLink}
                    arabicCheckoutText={arMessages[template.name]?.checkout}
                    englishCheckoutLink={enMessages[template.name]?.checkoutLink}
                    englishCheckoutText={enMessages[template.name]?.checkout}
                  />
                )}
              </div>
            </div>
          </div>
        </AnimatedInView>

        {/* 🔽 Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="px-6 md:px-12 lg:px-24 mt-20 text-center">
            <h2
              className={`text-2xl md:text-3xl font-bold mb-8 text-main ${locale === "ar" ? "text-right" : "text-left"
                }`}
            >
              {t("recommendedTitle") || "You might also like"}
            </h2>

            <AnimatedInView>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.map((rec, i) => (
                  <TemplateCard key={rec.id} template={rec} index={i} />
                ))}
              </div>
            </AnimatedInView>

            <div className="text-center mt-10">
              <Link
                href={`/${locale}/templates`}
                className="inline-block bg-transparent text-[#D7B180] border border-[#D7B180] font-semibold py-2 px-6 rounded-xl hover:bg-[#D7B180] hover:text-white transition duration-300"
              >
                {t("showMore") || "Show more templates"}
              </Link>
            </div>
          </div>
        )}
      </BlurText>
    </>
  );
}
