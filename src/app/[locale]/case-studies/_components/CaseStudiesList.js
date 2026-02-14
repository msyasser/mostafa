"use client";

import { useTranslations, useLocale } from "next-intl";
import { projects } from "@/src/app/[locale]/services/_data/projects";
import { Link } from "@/src/i18n/navigation";
import Image from "next/image";
import { BsArrowRight, BsArrowLeft, BsCalendar, BsTools, BsBriefcase } from "react-icons/bs";
import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";

export default function CaseStudiesList() {
    const t = useTranslations("CaseStudiesPage");
    const locale = useLocale();
    const isArabic = locale === "ar";
    const ArrowIcon = isArabic ? BsArrowLeft : BsArrowRight;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {projects.map((project, index) => (
                <AnimatedWrapper key={project.id} delay={index * 0.1}>
                    <Link
                        href={`/case-studies/${project.slug}`}
                        className="group flex flex-col h-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-main/50 transition-all duration-300 shadow-lg hover:shadow-main/10"
                    >
                        {/* Image / Thumbnail Section */}
                        <div className="relative h-60 w-full overflow-hidden transition-colors duration-500">
                            <Image
                                src={project.image}
                                alt={project.id}
                                fill
                                className="object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
                            />
                        </div>

                        {/* Content Section */}
                        <div className="p-6 flex-grow flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3 text-xs font-mono text-main/80">
                                    <BsBriefcase />
                                    <span className="uppercase tracking-wider">
                                        {project.metadata?.client || "Client Project"}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-main transition-colors leading-snug">
                                    {t(project.titleKey)}
                                </h3>

                                <p className="text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-3">
                                    {t(project.descriptionKey)}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.metadata?.tools?.split('·').slice(0, 3).map((tag, i) => (
                                        <span key={i} className="text-[10px] font-mono text-neutral-500 border border-neutral-800 px-2 py-1 rounded bg-neutral-950">
                                            {tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center text-sm font-medium text-white group-hover:text-main transition-colors mt-auto pt-4 border-t border-neutral-800">
                                {isArabic ? "عرض المشروع" : "View Case Study"}
                                <ArrowIcon className="ml-2 rtl:mr-2 rtl:ml-0 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                            </div>
                        </div>
                    </Link>
                </AnimatedWrapper>
            ))}
        </div>
    );
}
