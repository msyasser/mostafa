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
    <section className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-10">
      <h2 className="text-3xl font-bold uppercase leading-none tracking-tight sm:text-5xl rtl:normal-case rtl:leading-tight">
        {t("title")}
      </h2>
      <p className="mb-8 mt-3 text-base text-neutral-300 sm:text-xl">{t("subtitle")}</p>

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <li
            key={`${review.author}-${review.date}`}
            className="flex flex-col justify-between border-2 border-white p-5 sm:p-6"
          >
            <div>
              <div
                role="img"
                aria-label={t("rating", { rating: review.rating })}
                className="flex gap-1 text-main"
              >
                {Array.from({ length: review.rating }, (_, i) => (
                  <BsStarFill key={i} aria-hidden="true" className="text-sm" />
                ))}
              </div>
              <blockquote
                dir="auto"
                className="mt-4 text-xl font-medium leading-snug text-[#F4D9B6] sm:text-2xl"
              >
                {review.text}
              </blockquote>
            </div>
            <p className="mt-5 text-sm text-white">
              <bdi className="font-bold">{review.author}</bdi>
              <span className="text-neutral-400">
                {" · "}
                <time dateTime={review.date}>{dateFormat.format(new Date(review.date))}</time>
              </span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
