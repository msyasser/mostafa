import { useLocale, useTranslations } from "next-intl";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { CONTACT } from "@/src/lib/contactInfo";

export default function ContactDetails() {
    const t = useTranslations("ContactPage.details");
    const locale = useLocale();

    const items = [
        { key: "email", icon: MdEmail, value: CONTACT.email, href: `mailto:${CONTACT.email}` },
        { key: "phone", icon: MdPhone, value: CONTACT.phoneDisplay, href: `tel:${CONTACT.phone}` },
        { key: "location", icon: MdLocationOn, value: CONTACT.location[locale === "ar" ? "ar" : "en"] },
    ];

    return (
        <section className="bg-neutral-950 px-6 pb-16">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-8 text-center text-3xl font-bold text-white">{t("title")}</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {items.map((item) => {
                        const body = (
                            <>
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800 text-3xl text-main">
                                    <item.icon />
                                </div>
                                <div className="mb-1 text-sm text-neutral-400">{t(item.key)}</div>
                                <bdi dir={item.key === "location" ? undefined : "ltr"} className="text-lg font-semibold text-white">
                                    {item.value}
                                </bdi>
                            </>
                        );
                        const cls =
                            "flex flex-col items-center rounded-3xl border border-neutral-800 bg-neutral-900 p-8 text-center transition-colors hover:border-main/50";
                        return item.href ? (
                            <a key={item.key} href={item.href} className={cls}>
                                {body}
                            </a>
                        ) : (
                            <div key={item.key} className={cls}>
                                {body}
                            </div>
                        );
                    })}
                </div>
                <p className="mt-6 text-center text-sm text-neutral-400">{t("hours")}</p>
            </div>
        </section>
    );
}
