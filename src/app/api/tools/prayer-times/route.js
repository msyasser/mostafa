import { getJson, json, numberParam } from "../_lib/upstream";

// Today's prayer times and Hijri date for a location (Aladhan, Umm al-Qura method)
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const lat = numberParam(searchParams, "lat", -90, 90);
    const lng = numberParam(searchParams, "lng", -180, 180);
    if (lat === null || lng === null) return json({ error: "Invalid location" }, 400);

    try {
        const data = await getJson(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=4`, 900);
        if (!data?.data?.timings) throw new Error("Unexpected response");
        return json(data.data, 200, 900);
    } catch {
        return json({ error: "Prayer times are unavailable right now" }, 502);
    }
}
