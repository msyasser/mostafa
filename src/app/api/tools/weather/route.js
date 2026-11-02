import { getJson, json, numberParam } from "../_lib/upstream";

// Current weather for a location (Open-Meteo)
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const lat = numberParam(searchParams, "lat", -90, 90);
    const lng = numberParam(searchParams, "lng", -180, 180);
    if (lat === null || lng === null) return json({ error: "Invalid location" }, 400);

    try {
        const data = await getJson(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m`,
            600
        );
        if (!data?.current) throw new Error("Unexpected response");
        return json(data.current, 200, 600);
    } catch {
        return json({ error: "Weather is unavailable right now" }, 502);
    }
}
