"use client";

import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import Image from "next/image";
import { projects } from "../_data/projects";
import { BsArrowRight } from "react-icons/bs";

export default function CaseStudiesPreview() {
    const t = useTranslations("ServicesPage.caseStudies");
    const locale = useLocale();

    // Limit to first 3 projects
    const previewProjects = projects.slice(0, 3);

    return (
        <section id="case-studies" className="py-24 bg-neutral-900 border-t border-neutral-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <AnimatedWrapper>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <span className="text-main font-mono text-sm tracking-widest uppercase mb-2 block">Portfolio</span>
                            <h2 className="text-3xl md:text-5xl font-bold text-white">
                                {t("title")}
                            </h2>
                        </div>
                        <Link
                            href="/case-studies"
                            className="hidden md:flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
                        >
                            {t("viewAll")} <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </AnimatedWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {previewProjects.map((project, index) => (
                        <AnimatedWrapper key={project.id} delay={index * 0.1}>
                            <Link
                                href={`/case-studies/${project.slug}`}
                                className="block h-full group relative bg-neutral-800/20 rounded-2xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all duration-300"
                            >
                                {/* Image/Logo Area */}
                                <div className="h-64 bg-black/40 relative w-full overflow-hidden transition-colors duration-500">
                                    <Image
                                        src={project.image}
                                        alt={project.id}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
                                    />
                                </div>

                                <div className="p-8">
                                    <div className="text-xs font-mono text-main mb-3 uppercase tracking-wider">
                                        {project.metadata?.client || "Client Project"}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-main transition-colors">
                                        {/* Fallback to existing project title keys since they are specific */}
                                        {/* Or maybe we should use t() with fallback if we had new keys */}
                                    </h3>
                                    {/* Actually we need to access the translation for the project title. 
                                        The project object has 'titleKey'. 
                                        We must use useTranslations("CaseStudiesPage") for project keys as they are likely there. 
                                        But here we are using "ServicesPage.caseStudies". 
                                        We need another t function for project details. */}

                                    <ProjectTitle project={project} />

                                </div>
                            </Link>
                        </AnimatedWrapper>
                    ))}
                </div>

                <div className="md:hidden text-center mt-8">
                    <Link
                        href="/case-studies"
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors border border-neutral-700 rounded-full px-6 py-3 bg-neutral-800"
                    >
                        {t("viewAll")} <BsArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
}

// Helper component to handle different translation namespace
function ProjectTitle({ project }) {
    const t = useTranslations("CaseStudiesPage");
    return (
        <>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-main transition-colors">
                {t(project.titleKey)}
            </h3>
            <p className="text-neutral-400 line-clamp-2 text-sm leading-relaxed">
                {t(project.descriptionKey)}
            </p>
        </>
    );
}
