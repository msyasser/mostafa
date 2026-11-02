import { getJson, json } from "../_lib/upstream";

// Bitcoin, Ethereum and gold in USD (CoinGecko). Gold comes from PAX Gold (one token = one troy ounce),
// which follows the spot price closely.
export async function GET() {
    try {
        const data = await getJson(
            "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,pax-gold&vs_currencies=usd&include_24hr_change=true",
            60
        );
        const pick = (id) =>
            typeof data?.[id]?.usd === "number" ? { price: data[id].usd, change: data[id].usd_24h_change ?? 0 } : null;
        const result = { bitcoin: pick("bitcoin"), ethereum: pick("ethereum"), gold: pick("pax-gold") };
        if (!result.bitcoin && !result.ethereum && !result.gold) throw new Error("Unexpected response");
        return json(result, 200, 60);
    } catch {
        return json({ error: "Prices are unavailable right now" }, 502);
    }
}
