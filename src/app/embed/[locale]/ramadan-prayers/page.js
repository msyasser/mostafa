"use client";

import RamadanPrayers from "@/src/components/widgets/RamadanPrayers";
import EmbedWrapper from "@/src/components/EmbedWrapper";
import { useSearchParams } from "next/navigation";

export default function RamadanPrayersPage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");
    const city = searchParams.get("city");

    return (
        <EmbedWrapper>
            <RamadanPrayers theme={theme || "dark"} defaultCity={city || ""} />
        </EmbedWrapper>
    );
}
