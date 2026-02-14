"use client";

import WeatherWidget from "@/src/components/widgets/WeatherWidget";
import EmbedWrapper from "@/src/components/EmbedWrapper";
import { useSearchParams } from "next/navigation";

export default function WeatherWidgetPage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");
    const city = searchParams.get("city");

    return (
        <EmbedWrapper>
            <WeatherWidget
                theme={theme || "dark"}
                defaultCity={city || ""}
            />
        </EmbedWrapper>
    );
}
