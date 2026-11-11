// One place to control how prices convert. Update USD_TO_EGP when the rate moves a lot.
export const USD_TO_EGP = 53.35;
export const DEFAULT_CURRENCY = "EGP";

// Round so converted prices look like real price tags (e.g. 18,500 not 18,672).
function roundEgp(n) {
    const step = n >= 10000 ? 500 : n >= 1000 ? 50 : 10;
    return Math.round(n / step) * step;
}

export function convert(usd, currency) {
    return currency === "USD" ? usd : roundEgp(usd * USD_TO_EGP);
}

export function formatAmount(usd, currency, locale) {
    const v = convert(usd, currency);
    const num = new Intl.NumberFormat(locale === "ar" ? "ar-EG-u-nu-latn" : "en-US").format(v);
    if (currency === "USD") return `$${num}`;
    return locale === "ar" ? `${num} ج.م` : `EGP ${num}`;
}

export function formatRange(usdValues, currency, locale) {
    return usdValues.map((v) => formatAmount(v, currency, locale)).join(" – ");
}
