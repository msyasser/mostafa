"use client";

import WeatherWidget from "@/src/components/widgets/WeatherWidget";
import { useSearchParams } from "next/navigation";

export default function WeatherWidgetPage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");
    const city = searchParams.get("city");

    return (
        <div className="flex items-center justify-center min-h-screen">
            <WeatherWidget
                theme={theme || "dark"}
                defaultCity={city || ""}
            />
        </div>
    );
}
