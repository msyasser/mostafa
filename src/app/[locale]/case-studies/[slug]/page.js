import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { projects } from "../../services/_data/projects";
import { Link } from "@/src/i18n/navigation";
import ProjectGallery from "../_components/ProjectGallery";
import CaseStudyCard from "../_components/CaseStudyCard";

export function generateStaticParams() {
    const locales = ["en", "ar"];
    return projects.flatMap((project) =>
        locales.map((locale) => ({
            locale,
            slug: project.slug,
        }))
    );
}

export async function generateMetadata({ params }) {
    const { slug, locale } = await params;
    const project = projects.find((p) => p.slug === slug);

    if (!project) return {};

    const t = await getTranslations({ locale, namespace: "CaseStudiesPage" });
    const title = `${t(project.titleKey)} | ${locale === "ar" ? "دراسة حالة" : "Case Study"}`;
    const description = t(project.descriptionKey);
    const siteUrl = "https://www.mostafayasser.com";
    const url = `${siteUrl}/${locale}/case-studies/${slug}`;
    const imageUrl = project.image ? `${siteUrl}${project.image}` : `${siteUrl}/icon.png`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: "Mostafa Yasser",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
}

// The write-ups are Markdown with "---" between sections. Each section becomes its own card:
// the first heading is the card title, and "#" headings get the full width.
function splitSections(markdown) {
    return markdown
        .split(/\n\s*---\s*\n/)
        .map((chunk) => chunk.trim())
        .filter(Boolean)
        .map((chunk) => {
            const match = chunk.match(/^(#{1,3})\s+(.+)$/m);
            if (!match) return { level: 0, title: "", body: chunk };
            return {
                level: match[1].length,
                title: match[2].trim(),
                body: chunk.replace(match[0], "").trim(),
            };
        });
}

const prose = {
    h3: (props) => <h3 className="mb-1 mt-6 text-lg font-semibold text-white first:mt-0" {...props} />,
    p: (props) => <p className="mb-4 text-[15px] leading-relaxed text-neutral-300 last:mb-0" {...props} />,
    ul: (props) => <ul className="mb-4 space-y-2 last:mb-0" {...props} />,
    ol: (props) => <ol className="mb-4 list-decimal space-y-2 ps-5 marker:text-main last:mb-0" {...props} />,
    li: (props) => (
        <li
            className="relative ps-5 text-[15px] leading-relaxed text-neutral-300 before:absolute before:start-0 before:top-[0.6em] before:size-1.5 before:rounded-full before:bg-main"
            {...props}
        />
    ),
    strong: (props) => <strong className="font-semibold text-white" {...props} />,
    a: (props) => <a className="text-main underline underline-offset-4" {...props} />,
    blockquote: (props) => <blockquote className="my-4 border-s-2 border-main ps-4 text-neutral-300" {...props} />,
};

export default async function CaseStudyPage({ params }) {
    const { slug } = await params;

    const project = projects.find((p) => p.slug === slug);
    if (!project) notFound();

    const t = await getTranslations("CaseStudiesPage");
    const metaPrefix = project.contentKey.replace(/\.content$/, ".meta");
    const tools = project.metadata.tools.split("·").map((tool) => tool.trim());
    const sections = splitSections(t(project.contentKey));

    // The text before the first bold "Client: ..." line is the lead; the bold lines repeat the facts strip above.
    // A lead that only repeats the page description is skipped.
    const [first, ...rest] = sections;
    const hasIntro = first && first.level === 0;
    const leadText = hasIntro
        ? first.body
              .split(/\r?\n/)
              .filter((line) => !line.trim().startsWith("**"))
              .join(" ")
              .replace(/\*\*/g, "")
              .trim()
        : "";
    const description = t(project.descriptionKey);
    const lead = leadText && !description.startsWith(leadText.slice(0, 40)) ? leadText : "";
    // The overview section also repeats the facts strip, so it is left out
    const cards = (hasIntro ? rest : sections).filter((card) => !/overview|نظرة عامة/i.test(card.title));

    // Wide cards ("#" headings and the result) take the full row; a half-width card left alone in its row is widened too
    const wideFlags = cards.map((card) => card.level === 1 || card.level === 0 || /^(النتيجة|Result)/i.test(card.title));
    for (let i = 0; i < cards.length; ) {
        if (wideFlags[i]) {
            i += 1;
            continue;
        }
        let j = i;
        while (j < cards.length && !wideFlags[j]) j += 1;
        if ((j - i) % 2 === 1) wideFlags[j - 1] = true;
        i = j;
    }

    const facts = [
        { label: t("client"), value: t(`${metaPrefix}.client`) },
        { label: t("location"), value: t(`${metaPrefix}.location`) },
        { label: t("date"), value: t(`${metaPrefix}.date`) },
    ];
    const others = projects.filter((p) => p.slug !== slug);

    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-main selection:text-neutral-900">
            <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-10 md:pt-14">
                <Link
                    href="/case-studies"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
                >
                    <span className="inline-block rtl:-scale-x-100" aria-hidden="true">←</span>
                    {t("backLink")}
                </Link>

                {/* Header */}
                <header className="max-w-3xl">
                    <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-main rtl:text-sm rtl:tracking-normal rtl:[font-family:inherit]">
                        {t(`${metaPrefix}.client`)}
                    </span>
                    <h1 className="mt-3 text-4xl font-semibold leading-[1.15] md:text-5xl">{t(project.titleKey)}</h1>
                    <p className="mt-5 text-lg leading-relaxed text-neutral-400">{t(project.descriptionKey)}</p>
                </header>

                {/* Facts and tools */}
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {facts.map((fact) => (
                        <div key={fact.label} className="rounded-[18px] border border-main/20 bg-white/[0.045] px-5 py-4">
                            <span className="block text-xs text-neutral-400">{fact.label}</span>
                            <b className="mt-1 block text-lg font-medium text-white">
                                <bdi>{fact.value}</bdi>
                            </b>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-neutral-400">{t("tools")}</span>
                    {tools.map((tool) => (
                        <span key={tool} className="rounded-md border border-white/25 px-2.5 py-0.5 font-mono text-[11px] text-neutral-200">
                            {tool}
                        </span>
                    ))}
                </div>

                {/* Gallery */}
                <div className="mt-10">
                    <ProjectGallery images={project.images} title={t(project.titleKey)} />
                </div>

                {/* Write-up */}
                {lead && <p className="mt-12 max-w-3xl text-xl leading-relaxed text-neutral-200">{lead}</p>}

                <div className="mt-10 grid gap-4 md:grid-cols-2">
                    {cards.map((card, index) => {
                        const isResult = /^(النتيجة|Result)/i.test(card.title);
                        const wide = wideFlags[index];
                        return (
                            <section
                                key={`${card.title}-${index}`}
                                className={`rounded-[22px] p-7 md:p-8 ${wide ? "md:col-span-2" : ""} ${
                                    isResult
                                        ? "bg-gradient-to-br from-main to-[#be9462] text-neutral-900"
                                        : "border border-main/20 bg-white/[0.045]"
                                }`}
                            >
                                {card.title && (
                                    <h2 className={`mb-4 text-2xl font-semibold leading-tight ${isResult ? "text-neutral-900" : "text-white"}`}>
                                        {card.title}
                                    </h2>
                                )}
                                <div className={isResult ? "[&_li]:text-neutral-900 [&_li]:before:bg-neutral-900 [&_p]:text-neutral-900 [&_strong]:text-neutral-900" : ""}>
                                    <ReactMarkdown components={prose}>{card.body}</ReactMarkdown>
                                </div>
                            </section>
                        );
                    })}
                </div>

                {/* Call to action */}
                <div className="mt-14 rounded-[26px] border border-main bg-main/[0.04] p-8 text-center md:p-12">
                    <h2 className="text-3xl font-semibold md:text-4xl">{t("calendarTitle")}</h2>
                    <p className="mx-auto mt-3 max-w-xl text-neutral-400">{t("calendarDescription")}</p>
                    <Link
                        href="/services#calendar-section"
                        className="mt-6 inline-flex rounded-full bg-main px-8 py-3.5 text-[15px] font-semibold text-neutral-900 transition-transform duration-300 hover:scale-[1.03]"
                    >
                        {t("ctaButton")}
                    </Link>
                </div>

                {/* Other projects */}
                {others.length > 0 && (
                    <section className="mt-16">
                        <h2 className="mb-6 text-3xl font-semibold">{t("moreTitle")}</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {others.map((other) => (
                                <CaseStudyCard key={other.slug} project={other} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
