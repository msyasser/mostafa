"use client";

import RamadanPrayers from "@/src/components/widgets/RamadanPrayers";
import { useSearchParams } from "next/navigation";

export default function RamadanPrayersPage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");
    const city = searchParams.get("city");

    return (
        <div className="flex items-center justify-center min-h-screen">
            <RamadanPrayers theme={theme || "dark"} defaultCity={city || ""} />
        </div>
    );
}
