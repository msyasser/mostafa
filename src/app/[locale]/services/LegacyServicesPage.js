import BlurText from "@/src/app/[locale]/_components/BlurText";
import ServiceHero from "./_components/ServiceHero";
import TransformationValues from "./_components/TransformationValues";
import ProcessSteps from "./_components/ProcessSteps";
import CaseStudiesPreview from "./_components/CaseStudiesPreview";
import TargetAudience from "./_components/TargetAudience";
import WhyWorkWithMe from "./_components/WhyWorkWithMe";
import FAQ from "./_components/FAQ";
import ClientsStrip from "./_components/ClientsStrip";
import CalConsultation from "./_components/CalConsultation";
import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import { useTranslations } from "next-intl";

// The previous Services page. Arabic still uses it until the new design is translated.
export default function LegacyServicesPage() {
    // We need to use translation hook here if we have direct text, 
    // but most text is in components.
    // However, the Calendar section is here.
    const t = useTranslations("CaseStudiesPage"); // Keeping this for Calendar title fallback or use new keys if I move calendar to new json

    return (
        <BlurText>
            <div className="bg-neutral-950 min-h-screen text-white selection:bg-main selection:text-neutral-900">

                {/* 1. Hero Section */}
                <ServiceHero />

                {/* Logo Carousel */}
                <ClientsStrip />

                {/* 2. What I Actually Do */}
                <TransformationValues />

                {/* 3. My Approach */}
                <ProcessSteps />

                {/* 4. Case Studies Preview */}
                <CaseStudiesPreview />

                {/* 5. Who This Is For */}
                <TargetAudience />

                {/* 6. Why Work With Me */}
                <WhyWorkWithMe />

                {/* 7. FAQs */}
                <FAQ />

                {/* Calendar Section (Target for CTA) */}
                <div id="calendar-section" className="py-24 px-6 bg-neutral-900 border-t border-neutral-800 scroll-mt-32">
                    <div className="max-w-5xl mx-auto">
                        <AnimatedWrapper>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                    {t("calendarTitle")}
                                </h2>
                                <p className="text-gray-400 max-w-xl mx-auto text-lg">
                                    {t("calendarDescription")}
                                </p>
                            </div>

                            <div className="bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 p-2 sm:p-4 min-h-[650px]">
                                <CalConsultation />
                            </div>
                        </AnimatedWrapper>
                    </div>
                </div>

            </div>
        </BlurText>
    );
}
