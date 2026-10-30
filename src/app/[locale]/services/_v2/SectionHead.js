export default function SectionHead({ eyebrow, title, subtitle }) {
    return (
        <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
                <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-main rtl:tracking-normal">
                    {eyebrow}
                </span>
                <h2 className="mt-2 text-4xl font-semibold leading-[1.1] text-white md:text-5xl">{title}</h2>
            </div>
            {subtitle && <p className="max-w-md text-neutral-400">{subtitle}</p>}
        </div>
    );
}
