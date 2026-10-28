import { useLocale, useTranslations } from "next-intl";
import { BsStarFill } from "react-icons/bs";
import reviews from "../_data/reviews";

export default function Reviews() {
  const t = useTranslations("ConsultationPage.reviews");
  const locale = useLocale();
  // Latin digits in Arabic too, as in the rest of the site
  const dateFormat = new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : "en", {
    month: "short",
    year: "numeric",
  });

  return (
    <section className="border-t border-neutral-800 bg-neutral-900/40 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
        <p className="mt-2 text-neutral-400">{t("subtitle")}</p>

        <ul className="mt-10 gap-4 [column-fill:_balance] md:columns-2 lg:columns-3">
          {reviews.map((review) => (
            <li
              key={`${review.author}-${review.date}`}
              className="mb-4 break-inside-avoid rounded-2xl border border-neutral-800 bg-neutral-900 p-6"
            >
              <div
                role="img"
                aria-label={t("rating", { rating: review.rating })}
                className="flex gap-1 text-main"
              >
                {Array.from({ length: review.rating }, (_, i) => (
                  <BsStarFill key={i} aria-hidden="true" className="text-sm" />
                ))}
              </div>
              <blockquote dir="auto" className="mt-4 leading-relaxed text-neutral-100">
                {review.text}
              </blockquote>
              <p className="mt-5 text-sm font-semibold text-white">
                <bdi>{review.author}</bdi>
              </p>
              <p className="text-sm text-neutral-400">
                <time dateTime={review.date}>{dateFormat.format(new Date(review.date))}</time>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
