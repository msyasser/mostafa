"use client";

import QuoteWidget from "@/src/components/widgets/QuoteWidget";
import { useSearchParams } from "next/navigation";

export default function QuotePage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");

    return <QuoteWidget theme={theme || "dark"} />;
}
