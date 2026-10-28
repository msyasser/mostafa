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
    <section className="mx-auto w-full max-w-[1400px] px-6 py-16 sm:px-12 lg:px-20">
      <h2 className="text-4xl font-bold uppercase leading-none tracking-tight sm:text-6xl rtl:normal-case rtl:leading-tight">
        {t("title")}
      </h2>
      <p className="mb-10 mt-3 text-lg text-neutral-300 sm:text-2xl">{t("subtitle")}</p>

      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <li
            key={`${review.author}-${review.date}`}
            className="flex flex-col justify-between border-[3px] border-white p-6 sm:p-8"
          >
            <div>
              <div
                role="img"
                aria-label={t("rating", { rating: review.rating })}
                className="flex gap-1 text-main"
              >
                {Array.from({ length: review.rating }, (_, i) => (
                  <BsStarFill key={i} aria-hidden="true" className="text-base" />
                ))}
              </div>
              <blockquote
                dir="auto"
                className="mt-5 text-2xl font-medium leading-snug text-[#F4D9B6] sm:text-[1.7rem]"
              >
                {review.text}
              </blockquote>
            </div>
            <p className="mt-6 text-base text-white">
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
