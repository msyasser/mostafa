import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import SectionHead from "./SectionHead";

export default function Faq() {
    const t = useTranslations("ServicesPage.v2.faq");
    const items = t.raw("items");

    return (
        <section className="px-6 py-12 md:py-[70px]">
            <div className="mx-auto max-w-[1200px]">
                <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
                <div className="gap-4 md:columns-2">
                    {items.map((item, index) => (
                        <details
                            key={item.q}
                            open={index === 0}
                            className="group mb-3.5 break-inside-avoid rounded-[18px] border border-main/20 bg-white/[0.045] px-5 backdrop-blur-sm"
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-[18px] text-[19px] text-white [&::-webkit-details-marker]:hidden">
                                {item.q}
                                <span className="text-main group-open:hidden">+</span>
                                <span className="hidden text-main group-open:inline">–</span>
                            </summary>
                            <p className="pb-[18px] text-[15px] text-neutral-400">
                                {item.a}
                                {item.link && (
                                    <>
                                        {" "}
                                        <Link href={item.link.href} className="text-main underline underline-offset-4">
                                            {item.link.t}
                                        </Link>
                                    </>
                                )}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
