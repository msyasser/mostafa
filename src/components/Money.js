"use client";
import { useLocale } from "next-intl";
import useCurrency from "@/src/lib/useCurrency";
import { formatAmount } from "@/src/lib/currency";

// Renders a stored price string like "$79" in the visitor's currency (EGP by default).
// Anything that is not a plain dollar amount ("Free", "PRO", "soon", "$0") is shown as is.
export default function Money({ value }) {
    const currency = useCurrency();
    const locale = useLocale();
    const match = typeof value === "string" ? value.trim().match(/^\$([\d.,]+)$/) : null;
    const amount = match ? parseFloat(match[1].replace(/,/g, "")) : NaN;
    if (!amount) return <>{value}</>;
    return <bdi dir="ltr">{formatAmount(amount, currency, locale)}</bdi>;
}
