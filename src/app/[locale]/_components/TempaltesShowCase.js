import Link from "next/link";
import Image from "next/image";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { useLocale, useTranslations } from "next-intl";
import AnimatedInView from "./AnimatedInView";

const templates = {
  lifeChanging: [
    {
      id: 20,
      name: "Second Brain",
      slug: "second-brain",
      premium: true,
    },
    {
      id: 16,
      name: "StudyHub",
      slug: "study-hub",
      premium: true,
    },
  ],
  moreTemplates: [
    {
      id: 20,
      name: "Second Brain",
      slug: "second-brain",
      premium: true,
    },
    {
      id: 19,
      name: "FinanceHub",
      slug: "finance-hub",
      premium: true,
    },
    {
      id: 16,
      name: "StudyHub",
      slug: "study-hub",
      premium: true,
    },
  ],
  largeCollection: [
    {
      id: 2,
      name: "90-Day Challenge Premium",
      slug: "90-day-challenge-premium",
    },
    {
      id: 13,
      name: "TaskMaster",
      slug: "task-manager",
    },
    {
      id: 6,
      name: "Weekly Planner",
      slug: "weekly-planner",
    },
    {
      id: 8,
      name: "Reading Tracker",
      slug: "reading-tracker",
    },
    {
      id: 9,
      name: "90-Day Challenge",
      slug: "90-day-challenge",
    },
    {
      id: 10,
      name: "Quran Memorization",
      slug: "quran-memorization",
    },
    {
      id: 11,
      name: "Ramadan Tracker",
      slug: "ramadan-tracker",
    },
    {
      id: 36,
      name: "My Resources",
      slug: "my-resources",
    },
    {
      id: 38,
      name: "My Notes",
      slug: "my-notes",
    },
  ],
};

// Home page grid: the three premium systems, then three free templates picked by Mostafa:
// Second Brain (Minimal), whichever of TaskMaster / TaskHub is more downloaded and better rated, and 90-Day Challenge.
// Notion Marketplace numbers (English + Arabic listings together, collected 2026-10-28/29):
//   Second Brain Minimal  ~9.7K installs, 4.91 (198 ratings)
//   TaskMaster            ~550 installs, 4.85 (13 ratings)   <- chosen over TaskHub (~340 installs, 4.43, 7 ratings)
//   90-Day Challenge      ~2.4K installs, 4.57 (28 ratings)
const homeTemplates = [
  { id: 20, name: "Second Brain", slug: "second-brain", premium: true },
  { id: 19, name: "FinanceHub", slug: "finance-hub", premium: true },
  { id: 16, name: "StudyHub", slug: "study-hub", premium: true },
  { id: 23, name: "Second Brain - Minimal Version", slug: "second-brain-minimal" },
  { id: 13, name: "TaskMaster", slug: "task-manager" },
  { id: 9, name: "90-Day Challenge", slug: "90-day-challenge" },
];

export default function TemplatesShowcase({ title, subtitle }) {
  const t = useTranslations("TemplatesShowcase");
  const tt = useTranslations("TemplateSlug");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const ArrowIcon = isArabic ? BsArrowLeft : BsArrowRight;

  // "$0" reads as a price tag; "Free" says what it is
  const priceLabel = (name) => {
    const price = tt(`${name}.price`);
    return price === "$0" ? "Free" : price;
  };

  const renderTemplates = (list) =>
    list.map((template) => {
      const price = priceLabel(template.name);
      const isFree = price === "Free" || price === "مجاني";
      return (
        <Link
          key={template.id}
          href={`/${locale}/templates/${template.slug}`}
          className="group block"
        >
          <div className="relative">
            <Image
              src={tt(`${template.name}.image`)}
              alt={`Template ${tt(`${template.name}.name`)}`}
              width={800}
              height={645}
              className="w-full h-auto rounded-xl transition-transform duration-300 group-hover:-translate-y-1"
              unoptimized={true}
            />
            {template.premium && (
              <span className="absolute top-3 end-3 rounded-[3px] bg-main text-neutral-950 text-xs font-bold tracking-widest px-2 py-0.5">
                PRO
              </span>
            )}
          </div>
          <div className="mt-3.5 flex items-baseline justify-between gap-3 border-b border-[#3a3027] pb-3">
            <h3 className="text-lg sm:text-2xl font-semibold uppercase rtl:normal-case rtl:font-extrabold group-hover:text-main transition-colors">
              {tt(`${template.name}.name`)}
            </h3>
            <p className={`text-lg sm:text-2xl font-semibold shrink-0 ${isFree ? "text-neutral-400" : "text-main"}`}>
              {price}
            </p>
          </div>
        </Link>
      );
    });

  return (
    <div id="templates-section" className="w-full px-4 pt-20 pb-6 scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <AnimatedInView threshold={0.1}>
            <h2 className="text-3xl sm:text-5xl font-semibold uppercase rtl:normal-case rtl:font-extrabold tracking-tight">
              {title || t("popularTitle")}
            </h2>
          </AnimatedInView>
          <AnimatedInView threshold={0.1}>
            <p className="text-gray-300 mt-3 text-base sm:text-xl max-w-2xl">
              {subtitle || t("popularDescription")}
            </p>
          </AnimatedInView>
        </div>
        <AnimatedInView threshold={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10">
          {renderTemplates(homeTemplates)}
        </AnimatedInView>

        <div className="flex justify-center mt-12">
          <Link
            href={`/${locale}/templates`}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full border-[1.5px] border-[#3a3027] text-[#F4D9B6] font-semibold uppercase tracking-[0.06em] rtl:tracking-normal rtl:normal-case hover:border-main hover:text-main transition-colors"
          >
            {t("showMore")}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
