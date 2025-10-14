import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle, XCircle } from "lucide-react";
import enMessages from "@/messages/en/TemplateSlug.json";
import arMessages from "@/messages/ar/TemplateSlug.json";

export default function PricingSec({ template }) {
  const t = useTranslations("TemplateSlug");
  const locale = useLocale();

  // Use the appropriate messages based on the current locale
  const messages = locale === 'ar' ? arMessages : enMessages;

  // Get the basic plan with the correct link for the current locale
  const basic = t.raw(`${template.name}.pricingSec.plans.basic`);
  if (basic && messages[template.name]?.pricingSec?.plans?.basic) {
    basic.buttonLink = messages[template.name].pricingSec.plans.basic.buttonLink;
  }

  let advanced = null;
  if (t.has(`${template.name}.pricingSec.plans.advanced`)) {
    advanced = t.raw(`${template.name}.pricingSec.plans.advanced`);
    if (advanced && messages[template.name]?.pricingSec?.plans?.advanced) {
      advanced.buttonLink = messages[template.name].pricingSec.plans.advanced.buttonLink;
    }
  }

  let more_advanced = null;
  if (t.has(`${template.name}.pricingSec.plans.more-advanced`)) {
    more_advanced = t.raw(`${template.name}.pricingSec.plans.more-advanced`);
    if (more_advanced && messages[template.name]?.pricingSec?.plans?.['more-advanced']) {
      more_advanced.buttonLink = messages[template.name].pricingSec.plans['more-advanced'].buttonLink;
    }
  }

  const plans = [
    {
      data: basic,
      bg: "bg-white dark:bg-black",
      border: "border border-neutral-200 dark:border-neutral-700",
      text: "text-neutral-900 dark:text-white",
      buttonBg: "bg-white dark:bg-neutral-800",
      buttonText: "text-black dark:text-white",
      hoverBg: "hover:bg-neutral-100 dark:hover:bg-neutral-700",
      ringColor: "focus-visible:ring-main",
      shadow: "shadow hover:shadow-lg hover:scale-[1.02]",
      badgeBg: "",
    },
    {
      data: advanced,
      bg: "bg-yellow-100/60 dark:bg-yellow-900/30",
      border: "border border-yellow-200 dark:border-main/20",
      text: "text-neutral-900 dark:text-white",
      buttonBg: "bg-main",
      buttonText: "text-black",
      hoverBg: "hover:bg-main/80",
      ringColor: "focus-visible:ring-black",
      shadow: "shadow hover:shadow-lg hover:scale-[1.02]",
      badgeBg: "bg-main text-black",
      badgeText: "MOST POPULAR",
    },
    {
      data: more_advanced,
      bg: "bg-main text-black",
      border: "",
      text: "text-black",
      buttonBg: "bg-black",
      buttonText: "text-white",
      hoverBg: "hover:bg-neutral-800",
      ringColor: "focus-visible:ring-white",
      shadow: "shadow hover:shadow-lg hover:scale-[1.03]",
      badgeBg: "bg-white text-main",
    },
  ];

  return (
    <section id="pricing" className="w-full space-y-16 px-4 sm:px-8">
      {/* Title & Description */}
      <h2 className="text-3xl mt-24 sm:mt-32 sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-main leading-tight text-center">
        {t(`${template.name}.pricingSec.title`)}
      </h2>
      <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl leading-relaxed text-center mx-auto">
        {t(`${template.name}.pricingSec.description`)}
      </p>

      <div
        className={`grid grid-cols-1 ${plans.filter((plan) => plan.data).length === 2
          ? "md:grid-cols-2 max-w-4xl"
          : "md:grid-cols-3 max-w-7xl"
          } gap-10  mx-auto`}
      >
        {plans.map((plan, idx) => {
          if (!plan.data) return null;
          return (
            <div
              key={idx}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between ${plan.bg} ${plan.border} ${plan.shadow} transition-transform duration-200`}
            >
              {plan.data.badge || plan.badgeText ? (
                <span
                  className={`absolute top-4 right-4 ${plan.badgeBg} text-xs sm:text-sm font-medium px-2 py-0.5 rounded`}
                >
                  {plan.data.badge || plan.badgeText}
                </span>
              ) : null}

              <div>
                <h3 className="text-2xl sm:text-4xl font-bold mb-2">
                  {plan.data.label}
                </h3>
                <p
                  className={`text-sm sm:text-base mb-4 ${idx === 2
                    ? "text-neutral-800"
                    : "text-neutral-600 dark:text-neutral-300"
                    }`}
                >
                  {plan.data.description}
                </p>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-3xl font-bold">{plan.data.price}</span>
                  {plan.data.oldPrice && (
                    <span className="text-lg line-through text-neutral-400">
                      {plan.data.oldPrice}
                    </span>
                  )}
                </div>
                <ul
                  className={`text-sm sm:text-base space-y-2 mb-6 ${idx === 2
                    ? "text-black"
                    : "text-neutral-800 dark:text-neutral-300"
                    }`}
                >
                  {plan.data.features.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle
                        className={`w-5 h-5 ${idx === 2 ? "text-black" : "text-main"
                          }`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                  {plan.data.missingFeatures &&
                    plan.data.missingFeatures.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-neutral-400"
                      >
                        <XCircle className="w-5 h-5" />
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
              </div>
              {plan.data.buttonLink && plan.data.buttonLink.trim() !== '' ? (
                <Link
                  href={plan.data.buttonLink}
                  className={`mt-auto inline-block w-full text-center ${plan.buttonBg} ${plan.buttonText} font-semibold py-3 rounded-xl ${plan.hoverBg} transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${plan.ringColor} text-2xl`}
                >
                  {plan.data.button}
                </Link>
              ) : (
                <button
                  disabled
                  className={`mt-auto inline-block w-full text-center bg-gray-200 text-gray-400 font-semibold py-3 rounded-xl cursor-not-allowed opacity-60 text-2xl`}
                >
                  {plan.data.button}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
