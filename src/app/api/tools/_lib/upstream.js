// Small helpers shared by the /api/tools/* routes. The widgets call these routes instead of the public APIs
// directly, so every response is cached on the server (one upstream call serves many visitors) and no key or
// rate limit ever reaches the browser.

export const USER_AGENT = "mostafayasser.com-tools/1.0 (+https://www.mostafayasser.com/tools)";

export function json(body, status = 200, maxAge = 0) {
    return Response.json(body, {
        status,
        headers: maxAge
            ? { "Cache-Control": `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 4}` }
            : { "Cache-Control": "no-store" },
    });
}

// Fetches JSON from a fixed upstream URL and lets Next cache it for `revalidate` seconds
export async function getJson(url, revalidate) {
    const response = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
        next: { revalidate },
        signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`Upstream ${response.status}`);
    return response.json();
}

// Reads a number query parameter inside [min, max] and rounds it, or returns null
export function numberParam(searchParams, key, min, max, decimals = 2) {
    const raw = searchParams.get(key);
    if (raw === null || raw.trim() === "") return null;
    const value = Number(raw);
    if (!Number.isFinite(value) || value < min || value > max) return null;
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
}
