import { getJson, json } from "../_lib/upstream";

const EDITIONS = new Set(["quran-uthmani", "quran-indopak"]);
const RECITERS = new Set(["ar.alafasy", "ar.abdulbasitmurattal", "ar.hudhaify", "ar.husary", "ar.minshawi"]);

// ?mode=meta -> surah list; ?mode=ayah&verseId=&edition=&reciter= -> one verse with translation and audio (alquran.cloud)
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    try {
        if (mode === "meta") {
            const data = await getJson("https://api.alquran.cloud/v1/meta", 604800);
            return json(data, 200, 86400);
        }

        const verseId = Number(searchParams.get("verseId"));
        const edition = searchParams.get("edition") || "quran-uthmani";
        const reciter = searchParams.get("reciter") || "ar.alafasy";
        if (!Number.isInteger(verseId) || verseId < 1 || verseId > 6236 || !EDITIONS.has(edition) || !RECITERS.has(reciter)) {
            return json({ error: "Invalid verse request" }, 400);
        }

        const data = await getJson(`https://api.alquran.cloud/v1/ayah/${verseId}/editions/${edition},en.asad,${reciter}`, 86400);
        return json(data, 200, 86400);
    } catch {
        return json({ error: "The Quran service is unavailable right now" }, 502);
    }
}
