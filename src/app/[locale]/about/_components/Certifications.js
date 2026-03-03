"use client";

import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Certifications() {
    const t = useTranslations("AboutPage");
    const certImages = [
        { src: "/about/certifications/2.webp", alt: "Workflow Certification" },
        { src: "/about/certifications/3.webp", alt: "PMP Certification" },
        { src: "/about/certifications/4.webp", alt: "Notion Certified" },
        { src: "/about/certifications/5.webp", alt: "Notion Certified" }
    ];

    return (
        <section className="pt-0 pb-24 bg-neutral-950">
            <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
                <AnimatedWrapper>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-16">
                        {t("accreditationsTitle")}
                    </h2>
                </AnimatedWrapper>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-center">
                    {certImages.map((cert, index) => (
                        <AnimatedWrapper key={index} delay={index * 0.1}>
                            <div className="relative w-full h-32 md:h-40 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500 hover:scale-110 ease-out">
                                <Image
                                    src={cert.src}
                                    alt={cert.alt}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </AnimatedWrapper>
                    ))}
                </div>
            </div>
        </section>
    );
}
