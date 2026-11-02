import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";

// Same card as on the Services page: the real dashboard inside a small browser window
export default function CaseStudyCard({ project }) {
    const t = useTranslations("CaseStudiesPage");
    const metaPrefix = project.contentKey.replace(/\.content$/, ".meta");
    const tools = project.metadata.tools.split("·").map((tool) => tool.trim());

    return (
        <Link
            href={`/case-studies/${project.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-main/20 bg-white/[0.045] backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-main"
        >
            <div className="relative aspect-[3/2] overflow-hidden border-b border-main/20 bg-neutral-900 px-4 pt-4">
                <div className="relative h-full overflow-hidden rounded-t-xl border border-b-0 border-white/15 bg-black shadow-2xl">
                    <div className="flex h-6 items-center gap-1.5 border-b border-white/10 bg-neutral-800 px-3" aria-hidden="true">
                        <span className="size-2 rounded-full bg-white/25" />
                        <span className="size-2 rounded-full bg-white/25" />
                        <span className="size-2 rounded-full bg-white/25" />
                    </div>
                    <div className="relative h-[calc(100%-1.5rem)]">
                        <Image
                            src={project.cardImage}
                            alt={t(project.titleKey)}
                            fill
                            sizes="(min-width: 768px) 380px, 100vw"
                            className="object-cover object-left-top"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-neutral-900 to-transparent" aria-hidden="true" />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-neutral-900 to-transparent" aria-hidden="true" />
                    </div>
                </div>
            </div>
            <div className="flex flex-1 flex-col px-6 pb-7 pt-5">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-main rtl:text-sm rtl:tracking-normal rtl:[font-family:inherit]">
                    {t(`${metaPrefix}.client`)}
                </span>
                <h3 className="my-2 text-[23px] font-semibold leading-tight text-white">{t(project.titleKey)}</h3>
                <p className="line-clamp-3 text-[15px] text-neutral-400">{t(project.descriptionKey)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {tools.map((tool) => (
                        <span key={tool} className="rounded-md border border-white/25 px-2.5 py-0.5 font-mono text-[11px] text-neutral-200">
                            {tool}
                        </span>
                    ))}
                </div>
                <span className="mt-auto inline-block pt-4 text-[15px] font-semibold text-main">
                    {t("viewCaseStudy")}{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">→</span>
                </span>
            </div>
        </Link>
    );
}
