"use client";

import QuoteWidget from "@/src/components/widgets/QuoteWidget";
import EmbedWrapper from "@/src/components/EmbedWrapper";
import { useSearchParams } from "next/navigation";

export default function QuotePage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");

    return (
        <EmbedWrapper>
            <QuoteWidget theme={theme || "dark"} />
        </EmbedWrapper>
    );
}
