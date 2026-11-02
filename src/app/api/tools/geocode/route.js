import { getJson, json } from "../_lib/upstream";

// City name -> { lat, lng, name }. Open-Meteo's geocoder needs no key; Nominatim is the fallback.
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim().slice(0, 80);
    const lang = searchParams.get("lang") === "ar" ? "ar" : "en";
    if (query.length < 2) return json({ error: "Enter a city name" }, 400);

    try {
        const data = await getJson(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=${lang}&format=json`,
            604800
        );
        const place = data.results?.[0];
        if (place) {
            return json({ lat: place.latitude, lng: place.longitude, name: place.name }, 200, 86400);
        }
    } catch {
        // fall through to the second geocoder
    }

    try {
        const data = await getJson(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&accept-language=${lang}`,
            604800
        );
        if (Array.isArray(data) && data.length > 0) {
            return json(
                { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: String(data[0].display_name).split(",")[0] },
                200,
                86400
            );
        }
    } catch {
        return json({ error: "Geocoding is unavailable right now" }, 502);
    }

    return json({ error: "City not found" }, 404);
}
