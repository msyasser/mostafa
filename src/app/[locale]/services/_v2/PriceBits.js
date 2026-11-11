"use client";
import { useLocale } from "next-intl";
import useCurrency, { setCurrency } from "@/src/lib/useCurrency";
import { formatAmount, formatRange } from "@/src/lib/currency";

export function Price({ usd }) {
    const currency = useCurrency();
    const locale = useLocale();
    return <bdi dir="ltr">{formatRange(usd, currency, locale)}</bdi>;
}

// Replaces {currency} and {hourly} inside a translated sentence.
export function PriceText({ text, names, hourlyUsd = 35 }) {
    const currency = useCurrency();
    const locale = useLocale();
    const out = text
        .replace("{currency}", names[currency])
        .replace("{hourly}", formatAmount(hourlyUsd, currency, locale));
    return <>{out}</>;
}

export function CurrencyToggle({ label }) {
    const currency = useCurrency();
    return (
        <div className="mb-4 flex items-center justify-end gap-2 text-sm text-neutral-400">
            <span>{label}</span>
            <div className="inline-flex overflow-hidden rounded-full border border-main/30">
                {["EGP", "USD"].map((c) => (
                    <button
                        key={c}
                        type="button"
                        onClick={() => setCurrency(c)}
                        aria-pressed={currency === c}
                        className={`px-4 py-1.5 font-medium transition-colors ${
                            currency === c ? "bg-main text-neutral-900" : "text-neutral-300 hover:text-white"
                        }`}
                    >
                        {c}
                    </button>
                ))}
            </div>
        </div>
    );
}
