import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { BsArrowRight } from "react-icons/bs";
import { CREDLY_BADGE_URL } from "@/src/app/[locale]/_data/credentials";
import { course } from "../_data/course";
import { sections } from "../_data/curriculum";
import EnrollForm from "./EnrollForm";
import StickyEnrollBar from "./StickyEnrollBar";

const eyebrow = "font-mono text-[11px] uppercase tracking-[0.2em] text-main rtl:text-sm rtl:tracking-normal rtl:[font-family:inherit]";
const tile = "rounded-[22px] border border-main/20 bg-white/[0.045] p-5 backdrop-blur-sm";
const card = "rounded-[18px] border border-main/20 bg-white/[0.045] p-6";
const primaryBtn =
    "inline-flex items-center justify-center gap-2 rounded-full bg-main px-8 py-3.5 text-[15px] font-semibold text-neutral-900 transition-transform duration-300 hover:scale-[1.03]";
const ghostBtn =
    "inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-[15px] font-semibold text-white transition-colors duration-300 hover:border-main hover:text-main";

// Section heading: small label, title, and the supporting line directly under the title
// (same reading column, so the two always read as one block).
function SectionHead({ eyebrow: label, title, subtitle }) {
    return (
        <div className="mb-9 max-w-[760px]">
            <span className={`block ${eyebrow}`}>{label}</span>
            <h2 className="mt-2 text-[34px] font-semibold leading-[1.15] text-white md:text-5xl md:leading-[1.12]">{title}</h2>
            {subtitle && <p className="mt-4 max-w-[620px] text-[17px] leading-relaxed text-neutral-400 md:text-lg">{subtitle}</p>}
        </div>
    );
}

// Numbers shown on the page come from the real lesson list, so they stay right when lessons are added.
const allLessons = sections.flatMap((section) => section.lessons);
const totals = {
    videos: allLessons.length,
    practicals: allLessons.filter((lesson) => lesson.practical).length,
};
const sectionSeconds = (section) => section.lessons.reduce((sum, lesson) => sum + lesson.seconds, 0);

// The 4 stages of the journey, by section position in the curriculum.
const PHASE_SECTIONS = [[0, 1], [2, 3], [4], [5, 6]];

function clock(seconds) {
    const m = Math.floor(seconds / 60);
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
}

function useLength() {
    const t = useTranslations("NotionCoursePage.curriculum");
    return (seconds) => {
        const minutes = Math.round(seconds / 60);
        if (minutes < 60) return `${minutes} ${t("min")}`;
        const rest = minutes % 60;
        return rest ? `${Math.floor(minutes / 60)} ${t("hour")} ${rest} ${t("min")}` : `${Math.floor(minutes / 60)} ${t("hour")}`;
    };
}

function EnrollLink({ place, children, className = primaryBtn }) {
    return (
        <a href="#enroll" data-track="course_enroll_click" data-track-place={place} className={className}>
            {children} <BsArrowRight className="rtl:rotate-180" aria-hidden="true" />
        </a>
    );
}

function Hero() {
    const t = useTranslations("NotionCoursePage.hero");
    const badge = useTranslations("ServicesPage.v2.hero");
    const steps = t.raw("projectSteps");

    return (
        <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_500px_at_85%_-5%,rgba(215,177,128,0.14),transparent_60%),radial-gradient(600px_500px_at_-5%_40%,rgba(100,67,52,0.25),transparent_60%)]" />

            <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 px-6 pb-12 pt-16 sm:pt-20 lg:grid-cols-[1.1fr_1fr]">
                <div>
                    <span className={eyebrow}>{t("eyebrow")}</span>
                    <h1 className="mb-5 mt-4 text-[42px] font-semibold leading-[1.12] text-white sm:text-6xl lg:text-[62px]">
                        {t("titleStart")}
                        <em className="not-italic text-main">{t("titleEm")}</em>
                    </h1>
                    <p className="mb-7 max-w-[540px] text-lg leading-relaxed text-neutral-400 sm:text-[19px]">{t("subtitle")}</p>

                    <div id="course-hero-cta" className="flex flex-wrap gap-3">
                        <EnrollLink place="notion_course_hero">{t("ctaEnroll")}</EnrollLink>
                        <a href="#curriculum" data-track="course_curriculum_click" data-track-place="notion_course_hero" className={ghostBtn}>
                            {t("ctaCurriculum")}
                        </a>
                    </div>
                    <p className="mt-3 text-[13px] text-neutral-400">{t("note")}</p>
                </div>

                <div className="grid grid-cols-6 gap-3.5">
                    <div className="col-span-6 rounded-[22px] bg-gradient-to-br from-main to-[#be9462] p-5 text-neutral-900 sm:col-span-4">
                        <div className="flex items-end gap-3.5">
                            <div className="text-[54px] font-semibold leading-none"><bdi dir="ltr">{totals.videos}</bdi></div>
                            <div className="pb-1">
                                <div className="text-lg font-semibold leading-tight">{t("videosLabel")}</div>
                                <div className="text-[13px] opacity-80">
                                    <bdi dir="ltr">{t("hoursValue")}</bdi> {t("hoursLabel")}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`${tile} col-span-6 sm:col-span-2`}>
                        <div className="text-5xl font-semibold leading-none text-main"><bdi dir="ltr">{totals.practicals}</bdi></div>
                        <div className="mt-1.5 text-[13px] text-neutral-300">{t("practicalsLabel")}</div>
                    </div>

                    <div className={`${tile} col-span-6`}>
                        <span className={eyebrow}>{t("projectEyebrow")}</span>
                        <b className="mt-1.5 block text-[22px] font-semibold leading-tight text-white">{t("projectTitle")}</b>
                        <ol className="mt-3.5 flex flex-wrap gap-2">
                            {steps.map((step, index) => (
                                <li key={step} className="flex items-center gap-2 rounded-full border border-main/25 bg-neutral-950/60 py-1 pe-3 ps-1 text-[13px] text-neutral-200">
                                    <span className="grid size-6 place-items-center rounded-full bg-main/15 text-xs font-semibold text-main">{index + 1}</span>
                                    {step}
                                </li>
                            ))}
                        </ol>
                    </div>

                    <a
                        href={CREDLY_BADGE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${tile} col-span-6 flex items-center gap-3.5 transition-colors hover:border-main/60 sm:col-span-3`}
                    >
                        <Image src="/badges/notion-consulting-partner.webp" alt={badge("badgeTitle")} width={272} height={480} className="h-[72px] w-auto" />
                        <div>
                            <b className="block text-[17px] font-semibold leading-tight text-white">{badge("badgeTitle")}</b>
                            <span className="text-[13px] text-neutral-300">{badge("badgeNote")}</span>
                        </div>
                    </a>

                    <div className={`${tile} col-span-6 sm:col-span-3`}>
                        <b className="block text-[17px] font-semibold leading-tight text-white">{t("certTitle")}</b>
                        <span className="mt-1 block text-[13px] text-neutral-300">{t("certNote")}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Why() {
    const t = useTranslations("NotionCoursePage.why");
    return (
        <section className="px-6 py-12 md:py-[70px]">
            <div className="mx-auto max-w-[1200px]">
                <SectionHead eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
                <div className="grid gap-4 md:grid-cols-2">
                    {t.raw("items").map((item, index) => (
                        <div key={item.t} className={`${card} flex gap-4`}>
                            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-main bg-neutral-950 text-sm font-semibold text-main">
                                {index + 1}
                            </span>
                            <div>
                                <h3 className="text-xl font-semibold text-white">{item.t}</h3>
                                <p className="mt-2 text-[15px] leading-relaxed text-neutral-400">{item.d}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Audience() {
    const t = useTranslations("NotionCoursePage.audience");
    return (
        <section className="px-6 py-12 md:py-[70px]">
            <div className="mx-auto max-w-[1200px]">
                <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
                <div className="grid gap-4 md:grid-cols-3">
                    {t.raw("items").map((item, index) => (
                        <div key={item.t} className={card}>
                            <span className="text-sm font-semibold text-main"><bdi dir="ltr">0{index + 1}</bdi></span>
                            <h3 className="mt-2 text-[22px] font-semibold leading-tight text-white">{item.t}</h3>
                            <p className="mt-1.5 text-[15px] text-neutral-400">{item.d}</p>
                            <ul className="mt-4 space-y-2 border-t border-main/20 pt-4">
                                {item.li.map((line) => (
                                    <li key={line} className="text-[15px] text-neutral-200 before:text-main before:content-['–_']">
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <p className="mt-5 border-s-[3px] border-main/50 ps-3.5 text-[15px] text-neutral-400">
                    <b className="font-semibold text-neutral-200">{t("notForTitle")}</b> {t("notForText")}
                </p>
            </div>
        </section>
    );
}

function Journey() {
    const t = useTranslations("NotionCoursePage.journey");
    const locale = useLocale();
    const length = useLength();
    const phases = t.raw("phases");

    return (
        <section className="px-6 py-12 md:py-[70px]">
            <div className="mx-auto max-w-[1200px]">
                <SectionHead eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
                <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {phases.map((phase, index) => {
                        const parts = PHASE_SECTIONS[index].map((position) => sections[position]);
                        const seconds = parts.reduce((sum, section) => sum + sectionSeconds(section), 0);
                        return (
                            <li key={phase.t} className={`${card} flex flex-col`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-4xl font-semibold leading-none text-main"><bdi dir="ltr">0{index + 1}</bdi></span>
                                    <span className="text-[13px] text-neutral-400">{length(seconds)}</span>
                                </div>
                                <h3 className="mt-4 text-[22px] font-semibold leading-tight text-white">{phase.t}</h3>
                                <p className="mt-2 text-[15px] leading-relaxed text-neutral-400">{phase.d}</p>
                                <p className="mt-auto pt-4 text-[14px] text-neutral-200">
                                    <b className="font-semibold text-main">{t("practicalLabel")}</b> {phase.practical}
                                </p>
                                <span className="sr-only">{parts.map((section) => section[locale === "ar" ? "ar" : "en"]).join(", ")}</span>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}

function Curriculum() {
    const t = useTranslations("NotionCoursePage.curriculum");
    const locale = useLocale();
    const lang = locale === "ar" ? "ar" : "en";
    const length = useLength();

    return (
        <section id="curriculum" className="scroll-mt-24 px-6 py-12 md:py-[70px]">
            <div className="mx-auto max-w-[1200px]">
                <SectionHead eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
                <div className="space-y-3">
                    {sections.map((section, index) => (
                        <details key={section.en} open={index === 0} className="group rounded-[18px] border border-main/20 bg-white/[0.045] px-5">
                            <summary className="flex min-h-[64px] cursor-pointer list-none items-center gap-4 py-3.5 [&::-webkit-details-marker]:hidden">
                                <span className="w-8 shrink-0 text-lg font-semibold text-main"><bdi dir="ltr">{String(index + 1).padStart(2, "0")}</bdi></span>
                                <span className="flex-1 text-[19px] font-medium text-white">{section[lang]}</span>
                                <span className="hidden text-[13px] text-neutral-400 sm:inline">
                                    {section.lessons.length} {t("lessons")} · {length(sectionSeconds(section))}
                                </span>
                                <span className="text-xl text-main group-open:hidden" aria-hidden="true">+</span>
                                <span className="hidden text-xl text-main group-open:inline" aria-hidden="true">–</span>
                            </summary>
                            <ul className="border-t border-main/15 pb-3 pt-1">
                                {section.lessons.map((lesson) => (
                                    <li key={lesson.en + lesson.seconds} className="flex items-center gap-3 border-b border-white/5 py-2.5 text-[15px] last:border-b-0">
                                        <span className="flex-1 text-neutral-200">{lesson[lang]}</span>
                                        {lesson.practical && (
                                            <span className="shrink-0 rounded-md bg-main/15 px-2 py-0.5 text-xs font-semibold text-main">{t("practicalTag")}</span>
                                        )}
                                        <span className="w-12 shrink-0 text-end text-[13px] tabular-nums text-neutral-400"><bdi dir="ltr">{clock(lesson.seconds)}</bdi></span>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Instructor() {
    const t = useTranslations("NotionCoursePage.instructor");
    const stats = useTranslations("ServicesPage.v2.hero");
    const numbers = [
        { v: stats("ratingValue"), l: stats("ratingText") },
        { v: stats("systemsValue"), l: stats("systemsLabel") },
        { v: stats("downloadsValue"), l: stats("downloadsLabel") },
    ];

    return (
        <section className="px-6 py-12 md:py-[70px]">
            <div className="mx-auto grid max-w-[1200px] items-center gap-8 rounded-[26px] border border-main/20 bg-white/[0.045] p-6 md:grid-cols-[280px_1fr] md:p-10">
                <Image
                    src="/about/mostafa-portrait.webp"
                    alt={t("title")}
                    width={560}
                    height={700}
                    sizes="(min-width: 768px) 280px, 100vw"
                    className="aspect-[4/5] w-full rounded-[18px] object-cover object-[50%_20%]"
                />
                <div>
                    <span className={eyebrow}>{t("eyebrow")}</span>
                    <h2 className="mt-2 text-4xl font-semibold leading-[1.1] text-white md:text-5xl">{t("title")}</h2>
                    <p className="mt-4 max-w-[640px] text-[17px] leading-relaxed text-neutral-300">{t("p1")}</p>
                    <p className="mt-3 max-w-[640px] text-[17px] leading-relaxed text-neutral-400">{t("p2")}</p>
                    <dl className="mt-6 grid gap-3 sm:grid-cols-3">
                        {numbers.map((number) => (
                            <div key={number.l} className="rounded-[14px] border border-main/20 bg-neutral-950/60 px-4 py-3.5">
                                <dt className="sr-only">{number.l}</dt>
                                <dd className="text-3xl font-semibold leading-none text-main"><bdi dir="ltr">{number.v}</bdi></dd>
                                <dd className="mt-1.5 text-[13px] text-neutral-300">{number.l}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}

function AppSection() {
    const t = useTranslations("NotionCoursePage.app");
    return (
        <section className="px-6 py-12 md:py-[70px]">
            <div className="mx-auto max-w-[1200px]">
                <SectionHead eyebrow={t("eyebrow")} title={<bdi>{t("title")}</bdi>} subtitle={t("subtitle")} />
                <div className="grid gap-4 md:grid-cols-2">
                    {t.raw("items").map((item) => (
                        <div key={item.t} className={card}>
                            <h3 className="text-xl font-semibold text-white">{item.t}</h3>
                            <p className="mt-2 text-[15px] leading-relaxed text-neutral-400">{item.d}</p>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-sm text-neutral-400">{t("note")}</p>
            </div>
        </section>
    );
}

function Preview() {
    const t = useTranslations("NotionCoursePage.preview");
    return (
        <section className="px-6 py-12 md:py-[70px]">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-6 rounded-[26px] border border-main/20 bg-main/[0.06] p-8 md:flex-row md:items-center md:justify-between md:p-11">
                <div className="max-w-[680px]">
                    <span className={eyebrow}>{t("eyebrow")}</span>
                    <h2 className="mt-2 text-3xl font-semibold leading-[1.15] text-white md:text-[40px]">{t("title")}</h2>
                    <p className="mt-3 text-[17px] leading-relaxed text-neutral-400">{t("desc")}</p>
                </div>
                <a
                    href={course.freePlaylistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="course_free_preview_click"
                    data-track-place="notion_course_preview"
                    className={`${ghostBtn} shrink-0`}
                >
                    {t("cta")}
                </a>
            </div>
        </section>
    );
}

function Enroll() {
    const t = useTranslations("NotionCoursePage.enroll");
    return (
        <section id="enroll" className="scroll-mt-24 px-6 py-12 md:py-[70px]">
            <div className="mx-auto max-w-[1200px]">
                <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
                <div className="grid gap-4 rounded-[26px] border border-main bg-[radial-gradient(600px_300px_at_90%_0,rgba(215,177,128,0.18),transparent_70%)] bg-main/[0.04] p-6 md:grid-cols-[1.15fr_1fr] md:gap-10 md:p-10">
                    <div>
                        <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                            <span className="text-[64px] font-semibold leading-none text-main"><bdi dir="ltr">{t("priceValue")}</bdi></span>
                            <span className="pb-2 text-lg text-white">{t("priceUnit")}</span>
                        </div>
                        <p className="mt-1.5 text-sm text-neutral-400">{t("priceNote")}</p>

                        <h3 className="mb-3 mt-7 text-xl font-semibold text-white">{t("includesTitle")}</h3>
                        <ul className="space-y-2.5">
                            {t.raw("includes").map((line) => (
                                <li key={line} className="flex gap-3 text-[16px] text-neutral-200">
                                    <span className="mt-[7px] size-2 shrink-0 rounded-full bg-main" aria-hidden="true" />
                                    {line}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-[18px] border border-[#3d342b] bg-[#171411] p-5 md:p-6">
                        <EnrollForm />
                    </div>
                </div>
            </div>
        </section>
    );
}

function Faq() {
    const t = useTranslations("NotionCoursePage.faq");
    return (
        <section className="px-6 py-12 md:py-[70px]">
            <div className="mx-auto max-w-[1200px]">
                <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
                <div className="gap-4 md:columns-2">
                    {t.raw("items").map((item, index) => (
                        <details key={item.q} open={index === 0} className="group mb-3.5 break-inside-avoid rounded-[18px] border border-main/20 bg-white/[0.045] px-5">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-[18px] text-[19px] text-white [&::-webkit-details-marker]:hidden">
                                {item.q}
                                <span className="text-main group-open:hidden" aria-hidden="true">+</span>
                                <span className="hidden text-main group-open:inline" aria-hidden="true">–</span>
                            </summary>
                            <p className="pb-[18px] text-[15px] leading-relaxed text-neutral-400">{item.a}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Final() {
    const t = useTranslations("NotionCoursePage.final");
    return (
        <section className="px-6 pb-28 pt-8 text-center md:pb-24">
            <div className="mx-auto max-w-[760px]">
                <h2 className="text-4xl font-semibold leading-[1.15] text-white md:text-5xl">{t("title")}</h2>
                <p className="mx-auto mt-4 max-w-[520px] text-lg text-neutral-400">{t("desc")}</p>
                <div className="mt-7">
                    <EnrollLink place="notion_course_final">{t("cta")}</EnrollLink>
                </div>
            </div>
        </section>
    );
}

export default function CoursePage() {
    const t = useTranslations("NotionCoursePage.sticky");
    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-main selection:text-neutral-900">
            <Hero />
            <Why />
            <Audience />
            <Journey />
            <Curriculum />
            <Instructor />
            <AppSection />
            {course.showFreePreview && <Preview />}
            <Enroll />
            <Faq />
            <Final />
            <StickyEnrollBar label={t("cta")} sub={t("sub")} />
        </div>
    );
}
