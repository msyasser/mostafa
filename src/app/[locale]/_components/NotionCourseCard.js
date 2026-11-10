import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { BsArrowRight } from "react-icons/bs";

// The one course card of the site (home page and the courses page). `href` is the course page link.
// The cover is a ready-made image per language: public/courses/notion-course-{ar,en}.webp
export default function NotionCourseCard({ href, place }) {
    const t = useTranslations("NotionCoursePage");
    const lang = useLocale() === "ar" ? "ar" : "en";

    return (
        <a
            href={href}
            data-track="course_details_click"
            data-track-place={place}
            className="group grid overflow-hidden rounded-[22px] border border-main/30 bg-[#14110F] text-start transition-colors duration-300 hover:border-main lg:grid-cols-[1.55fr_1fr] lg:items-center"
        >
            {/* Always 16:9, so the cover is never cropped */}
            <div className="relative aspect-video overflow-hidden bg-neutral-950">
                <Image
                    src={`/courses/notion-course-${lang}.webp`}
                    alt={t("card.title")}
                    fill
                    sizes="(min-width: 1024px) 780px, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-9">
                <span className="w-fit rounded-md bg-main px-2.5 py-0.5 text-xs font-semibold text-neutral-900">{t("card.badge")}</span>
                <h3 className="mt-4 text-2xl font-semibold leading-tight text-white transition-colors duration-300 group-hover:text-main sm:text-[34px]">
                    {t("card.title")}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-300 sm:text-lg">{t("card.desc")}</p>
                <p className="mt-4 text-sm text-neutral-400">{t("hero.note")}</p>
                <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-main px-7 py-3 font-semibold text-neutral-900 transition-transform duration-300 group-hover:scale-[1.03]">
                    {t("card.cta")} <BsArrowRight className="rtl:rotate-180" aria-hidden="true" />
                </span>
            </div>
        </a>
    );
}
