import Link from "next/link";
import Image from "next/image";
import GoToTemplatesPageButton from "@/src/app/[locale]/_components/GoToTemplatesPageButton";
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

export default function TemplatesShowcase({ title, subtitle }) {
  const t = useTranslations("TemplatesShowcase");
  const tt = useTranslations("TemplateSlug");
  const locale = useLocale();

  const renderTemplates = (list) =>
    list.map((template) => (
      <Link
        key={template.id}
        href={`/${locale}/templates/${template.slug}`}
        className="relative rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] hover:-translate-y-2 overflow-hidden ease-in-out cursor-pointer hover:shadow-main"
      >
        {template.premium && (
          <span className="absolute top-9 right-0 rounded-tl-xl rounded-bl-xl border border-[#D7B180] text-[#D7B180] text-sm font-semibold px-4 py-1 -mr-1 z-50">
            PRO
          </span>
        )}

        <div className="w-full aspect-[4/3] relative">
          <Image
            src={tt(`${template.name}.image`)}
            alt={`Template ${tt(`${template.name}.name`)}`}
            width={800}
            height={800}
            className="object-cover w-full h-full"
            unoptimized={true}
          />
        </div>
        <h3 className="mt-3 text-sm sm:text-xl md:text-2xl font-semibold">
          {tt(`${template.name}.name`)}
        </h3>
        <p className="text-[#D7B180] text-lg sm:text-xl md:text-2xl font-bold mb-4 drop-shadow-[0_0_5px_rgba(215,177,128,0.4)]">
          {tt(`${template.name}.price`)}
        </p>
      </Link>
    ));

  return (
    <div id="templates-section" className="w-full px-6 py-12 sm:mt-12 mt-10 text-center flex flex-col gap-5 sm:gap-20 scroll-mt-32">


      <div className="mt-4">
        <div className="text-center max-w-3xl mx-auto px-4">
          <AnimatedInView threshold={0.1}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              {title || t("popularTitle")}
            </h2>
          </AnimatedInView>
          <AnimatedInView threshold={0.1}>
            <p className="text-secondary mt-2 text-base sm:text-lg md:text-xl">
              {subtitle || t("popularDescription")}
            </p>
          </AnimatedInView>
        </div>
        <AnimatedInView
          threshold={0.1}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8"
        >
          {renderTemplates([...templates.moreTemplates, ...templates.largeCollection].slice(0, 6))}
        </AnimatedInView>
      </div>

      <GoToTemplatesPageButton
        text={t("showMore")}
        className={"flex justify-center mt-6 sm:mt-10 relative z-10 px-4"}
      />
    </div>
  );
}
