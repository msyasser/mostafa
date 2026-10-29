import { useLocale, useTranslations } from "next-intl";
import { BsStarFill, BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { reviewsEn, reviewsAr } from "../_data/homeReviews";

export default function HomeReviews() {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const reviews = isArabic ? reviewsAr : reviewsEn;
  const ArrowIcon = isArabic ? BsArrowLeft : BsArrowRight;
  const profileUrl = isArabic ? "https://www.notion.com/ar/@mostafa" : "https://www.notion.com/@mostafa";

  // Latin digits in Arabic too, as in the rest of the site
  const dateFormat = new Intl.DateTimeFormat(isArabic ? "ar-u-nu-latn" : "en", {
    month: isArabic ? "long" : "short",
    year: "numeric",
  });

  return (
    <section id="reviews-section" className="w-full pt-24 pb-6 px-4 relative z-10 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-5xl font-semibold uppercase rtl:normal-case rtl:font-extrabold text-white tracking-tight">
            {t("reviewsTitle")}
          </h2>
          <p className="text-gray-300 text-base sm:text-xl max-w-2xl mt-3">{t("reviewsSubtitle")}</p>
          <dl className="mt-6 flex flex-wrap gap-x-11 gap-y-3">
            <div className="flex items-baseline gap-2.5">
              <dd className="text-3xl sm:text-4xl font-semibold text-main">{t("reviewsAvgValue")}</dd>
              <dt className="text-sm text-neutral-400 uppercase tracking-wider rtl:tracking-normal rtl:normal-case">
                {t("reviewsAvgLabel")}
              </dt>
            </div>
            <div className="flex items-baseline gap-2.5">
              <dd className="text-3xl sm:text-4xl font-semibold text-main">{t("reviewsCountValue")}</dd>
              <dt className="text-sm text-neutral-400 uppercase tracking-wider rtl:tracking-normal rtl:normal-case">
                {t("reviewsCountLabel")}
              </dt>
            </div>
          </dl>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => {
            const lines = Array.isArray(review.text) ? review.text : [review.text];
            return (
              <li
                key={`${review.name}-${review.date}`}
                className="flex flex-col justify-between gap-6 rounded-md border border-[#3a3027] bg-[#14110F] p-6"
              >
                <div>
                  <div role="img" aria-label="5 / 5" className="flex gap-1 text-main text-sm">
                    {Array.from({ length: 5 }, (_, i) => (
                      <BsStarFill key={i} aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote dir="auto" className="mt-4 text-xl leading-snug text-[#F4D9B6] font-medium">
                    {lines.map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </blockquote>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-[#3a3027] bg-[#1B1713] text-main font-semibold"
                  >
                    {[...review.name][0].toUpperCase()}
                  </span>
                  <div className="min-w-0 flex flex-col items-start">
                    <bdi className="text-base font-semibold leading-tight text-white">{review.name}</bdi>
                    <small className="mt-0.5 text-[13px] text-neutral-400">
                      <bdi>{review.template}</bdi> · <time dateTime={review.date}>{dateFormat.format(new Date(review.date))}</time>
                    </small>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex justify-center mt-10">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full border-[1.5px] border-[#3a3027] text-[#F4D9B6] font-semibold uppercase tracking-[0.06em] rtl:tracking-normal rtl:normal-case hover:border-main hover:text-main transition-colors"
          >
            {t("reviewsAll")}
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
