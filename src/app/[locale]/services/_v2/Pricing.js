import { useTranslations } from "next-intl";
import SectionHead from "./SectionHead";

function Row({ row, bestFor }) {
    return (
        <div
            className={`grid items-center gap-x-6 gap-y-3 border-b border-main/20 px-7 py-6 last:border-b-0 md:grid-cols-[1.1fr_1.7fr_1fr] ${
                row.badge ? "bg-main/[0.08] shadow-[inset_3px_0_0_0_#d7b180] rtl:shadow-[inset_-3px_0_0_0_#d7b180]" : ""
            }`}
        >
            <div>
                {row.badge && (
                    <span className="mb-1.5 inline-block rounded-md bg-main px-2.5 py-0.5 text-xs font-semibold text-neutral-900">{row.badge}</span>
                )}
                <h4 className="text-2xl font-semibold leading-tight text-white">{row.t}</h4>
                {row.tag && <div className="mt-0.5 text-sm text-neutral-400">{row.tag}</div>}
                {row.best && (
                    <div className="mt-0.5 text-sm text-neutral-400">
                        {bestFor} {row.best}
                    </div>
                )}
            </div>
            <ul>
                {row.li.map((item) => (
                    <li key={item} className="py-px text-sm text-neutral-200 before:text-main before:content-['–_']">
                        {item}
                    </li>
                ))}
            </ul>
            <div>
                <div className="text-[32px] font-semibold leading-tight text-main">
                    <bdi dir="ltr">{row.p}</bdi>
                </div>
                <small className="mt-0.5 block text-xs text-neutral-400">{row.u}</small>
            </div>
        </div>
    );
}

function Group({ group, bestFor, footer }) {
    return (
        <div className="mb-4 overflow-hidden rounded-[22px] border border-main/20 bg-white/[0.045] backdrop-blur-sm">
            <div className="border-b border-main/20 bg-main/10 px-7 py-4">
                <h3 className="text-[22px] font-medium text-white">{group.title}</h3>
                <span className="text-[13px] text-neutral-400">{group.sub}</span>
            </div>
            {group.rows.map((row) => (
                <Row key={row.t} row={row} bestFor={bestFor} />
            ))}
            {footer}
        </div>
    );
}

export default function Pricing() {
    const t = useTranslations("ServicesPage.v2.pricing");
    const groups = t.raw("groups");
    const gate = t.raw("gate");
    const notes = t.raw("notes");
    const detailsItems = t.raw("detailsItems");
    const bestFor = t("bestFor");

    return (
        <section id="pricing" className="scroll-mt-24 px-6 py-12 md:py-[70px]">
            <div className="mx-auto max-w-[1200px]">
                <SectionHead
                    eyebrow={t("eyebrow")}
                    title={
                        <>
                            {t("titleLine1")}
                            <br />
                            {t("titleLine2")}
                        </>
                    }
                    subtitle={t("subtitle")}
                />

                <Group group={groups.start} bestFor={bestFor} />
                <Group
                    group={groups.projects}
                    bestFor={bestFor}
                    footer={
                        <div className="border-t border-main/20 px-7 py-3.5 text-center text-[13px] text-neutral-400">
                            {t("budgetPrefix")}{" "}
                            <a href="#calendar-section" className="text-main underline underline-offset-4">
                                {t("budgetLink")}
                            </a>
                        </div>
                    }
                />
                <Group group={groups.support} bestFor={bestFor} />

                <details className="group my-3.5 rounded-2xl border border-main/20 bg-white/[0.045] px-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-[15px] text-white [&::-webkit-details-marker]:hidden">
                        {t("detailsSummary")}
                        <span className="text-main group-open:hidden">+</span>
                        <span className="hidden text-main group-open:inline">–</span>
                    </summary>
                    <ul className="space-y-1.5 pb-4 text-sm text-neutral-300">
                        {detailsItems.map((item) => (
                            <li key={item} className="before:text-main before:content-['–_']">
                                {item}
                            </li>
                        ))}
                    </ul>
                </details>
                <ul className="space-y-1 px-1 text-sm text-neutral-300">
                    {notes.map((note) => (
                        <li key={note} className="before:text-main before:content-['•_']">
                            {note}
                        </li>
                    ))}
                </ul>

                <div className="mt-9 rounded-[26px] border border-main bg-[radial-gradient(600px_300px_at_90%_0,rgba(215,177,128,0.2),transparent_70%)] bg-main/[0.04] p-8 backdrop-blur-sm md:p-11">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-main rtl:text-sm rtl:tracking-normal rtl:[font-family:inherit]">{gate.eyebrow}</span>
                    <h3 className="mb-2 mt-2 text-4xl font-semibold leading-[1.1] text-white md:text-[42px]">{gate.title}</h3>
                    <p className="max-w-[700px] text-neutral-400">{gate.desc}</p>
                    <div className="mb-2 mt-6 grid gap-3.5 md:grid-cols-3">
                        {gate.opts.map((opt) => (
                            <div key={opt.t} className="rounded-[18px] border border-main/20 bg-neutral-950/60 px-5 py-4">
                                <b className="block text-xl font-medium text-white">{opt.t}</b>
                                <span className="text-sm text-neutral-400">{opt.d}</span>
                            </div>
                        ))}
                    </div>
                    <p className="my-4 border-s-[3px] border-main ps-3.5 text-white">{gate.principle}</p>
                    <a
                        href="#calendar-section"
                        className="inline-flex rounded-full bg-main px-8 py-3.5 text-[15px] font-semibold text-neutral-900 transition-transform duration-300 hover:scale-[1.03]"
                    >
                        {gate.cta}
                    </a>
                </div>
            </div>
        </section>
    );
}
