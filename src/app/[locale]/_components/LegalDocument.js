import { useTranslations } from "next-intl";
import { CONTACT } from "@/src/lib/contactInfo";

// Renders a policy page from messages: { title, effectiveDate, intro, sections: [{ title, content: string | string[] }], contact: { title, text } }
export default function LegalDocument({ namespace }) {
    const t = useTranslations(namespace);
    const sections = t.raw("sections");

    return (
        <div className="flex min-h-screen items-center justify-center px-4 pt-16">
            <div className="w-full max-w-3xl space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-lg">
                <div className="text-center">
                    <h1 className="mb-2 text-4xl font-bold text-main md:text-5xl">{t("title")}</h1>
                    <p className="text-sm text-gray-400">{t("effectiveDate")}</p>
                </div>

                <p className="text-gray-300">{t("intro")}</p>

                {sections.map((section) => (
                    <section key={section.title}>
                        <h2 className="mb-2 text-xl font-semibold text-main">{section.title}</h2>
                        {Array.isArray(section.content) ? (
                            <ul className="list-inside list-disc space-y-1 text-gray-200">
                                {section.content.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-300">{section.content}</p>
                        )}
                    </section>
                ))}

                <section>
                    <h2 className="mb-2 text-xl font-semibold text-main">{t("contact.title")}</h2>
                    <p className="text-gray-300">
                        {t("contact.text")}{" "}
                        <a href={`mailto:${CONTACT.email}`} className="font-bold text-main transition-colors hover:text-white">
                            <bdi dir="ltr">{CONTACT.email}</bdi>
                        </a>
                        {" · "}
                        <a href={`tel:${CONTACT.phone}`} className="font-bold text-main transition-colors hover:text-white">
                            <bdi dir="ltr">{CONTACT.phoneDisplay}</bdi>
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
