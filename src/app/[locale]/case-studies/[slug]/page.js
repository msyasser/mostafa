
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { projects } from "../../services/_data/projects";
import { Link } from "@/src/i18n/navigation";
import { BsArrowLeft } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { FaBriefcase, FaMapMarkerAlt, FaTools, FaCalendarAlt } from "react-icons/fa";
import NotionCalendarButton from "@/src/app/[locale]/_components/NotionCalendarButton";
import ProjectGallery from "../_components/ProjectGallery";

export function generateStaticParams() {
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { slug, locale } = await params;
    const project = projects.find((p) => p.slug === slug);

    if (!project) return {};

    const t = await getTranslations("CaseStudiesPage");
    const title = `${t(project.titleKey)} | Case Study`;
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

export default async function CaseStudyPage({ params }) {
    const { slug, locale } = await params;

    // Find the project data
    const projectIndex = projects.findIndex((p) => p.slug === slug);
    const project = projects[projectIndex];

    if (!project) {
        notFound();
    }

    const t = await getTranslations("CaseStudiesPage");

    return (
        <div className="min-h-screen bg-[#191919] text-[#D4D4D4] selection:bg-[#3f2e1e] selection:text-[#eb5e28] py-8 lg:py-16">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">

                {/* Back Link */}
                <Link
                    href="/case-studies"
                    className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-12 hover:-translate-x-1 duration-300"
                >
                    <BsArrowLeft />
                    <span>Back to Case Studies</span>
                </Link>

                {/* Header Section - Title, Desc, Gallery */}
                <div className="mb-16 space-y-8">
                    <div className="max-w-4xl">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            {t(project.titleKey)}
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            {t(project.descriptionKey)}
                        </p>
                    </div>

                    {/* Interactive Gallery */}
                    <ProjectGallery
                        images={project.images}
                        title={t(project.titleKey)}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Main Content (Left on Desktop) */}
                    <div className="lg:col-span-8 order-2 lg:order-1">
                        <div className="prose prose-invert max-w-none text-[#D4D4D4]">
                            <div className="markdown-content space-y-8">
                                <ReactMarkdown
                                    components={{
                                        // Headers - Mimic Notion headings
                                        h1: ({ node, ...props }) => <h2 className="text-3xl font-bold mt-12 mb-6 text-white" {...props} />, // Map H1 to H2 style inside content
                                        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-10 mb-4 text-white border-b border-[#333] pb-2" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-8 mb-3 text-white" {...props} />,

                                        // Paragraphs & Lists
                                        p: ({ node, ...props }) => <p className="mb-6 leading-relaxed text-[17px]" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2 marker:text-gray-500" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-6 space-y-2 marker:text-gray-500" {...props} />,
                                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,

                                        // Bold & Links
                                        strong: ({ node, ...props }) => <strong className="text-white font-semibold" {...props} />,
                                        a: ({ node, ...props }) => <a className="text-[#d7b180] hover:underline underline-offset-4 decoration-[#d7b180]/30" {...props} />,

                                        // Horizontal Rule
                                        hr: ({ node, ...props }) => <hr className="my-12 border-[#333]" {...props} />,

                                        // Blockquote -> Notion Callout Style
                                        blockquote: ({ node, ...props }) => (
                                            <div className="my-8 bg-[#202020] border-l-4 border-[#d7b180] rounded-r-lg p-5 shadow-sm">
                                                <blockquote className="m-0 italic text-gray-300" {...props} />
                                            </div>
                                        ),
                                    }}
                                >
                                    {t(project.contentKey)}
                                </ReactMarkdown>

                                <div className="lg:hidden mt-12 py-8 border-t border-[#333]">
                                    <NotionCalendarButton label="Book Consultation" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Sidebar (Right on Desktop) - Metadata */}
                    <div className="lg:col-span-4 relative order-1 lg:order-2">
                        <div className="sticky top-24 space-y-8">

                            {/* Metadata Properties - Notion Style */}
                            <div className="bg-[#202020] rounded-lg border border-[#333] p-6 space-y-4 shadow-xl">
                                <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest opacity-50">Project Details</h3>

                                {project.metadata && (
                                    <>
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 text-gray-500"><FaBriefcase /></div>
                                            <div>
                                                <span className="block text-xs uppercase text-gray-500 mb-1">Client</span>
                                                <span className="text-white font-medium">{project.metadata.client}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 text-gray-500"><FaMapMarkerAlt /></div>
                                            <div>
                                                <span className="block text-xs uppercase text-gray-500 mb-1">Location</span>
                                                <span className="text-white font-medium">{project.metadata.location}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 text-gray-500"><FaCalendarAlt /></div>
                                            <div>
                                                <span className="block text-xs uppercase text-gray-500 mb-1">Date</span>
                                                <span className="text-white font-medium">{project.metadata.date}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 text-gray-500"><FaTools /></div>
                                            <div>
                                                <span className="block text-xs uppercase text-gray-500 mb-1">Tools</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.metadata.tools.split('·').map((tool, i) => (
                                                        <span key={i} className="inline-block bg-[#2C2C2C] text-gray-300 text-xs px-2 py-1 rounded border border-[#333]">
                                                            {tool.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* CTA */}
                            <div className="hidden lg:block">
                                <NotionCalendarButton label="Book Consultation" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
