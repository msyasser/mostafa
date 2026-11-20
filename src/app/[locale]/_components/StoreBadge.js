// The official "Get it from Microsoft" badge (static version from apps.microsoft.com/badge), for the MY Hub app.
// The images are Microsoft's own SVGs, kept in /public/badges so the page does not load anything from Microsoft.
// Light badge on our dark pages, as Microsoft's guidance says. `place` becomes the campaign id (cid), so
// Partner Center shows which page each install came from.
const STORE_ID = "9NGS8111LT4V";

export function storeLive() {
  return /^https:\/\//.test(process.env.NEXT_PUBLIC_MYHUB_STORE_URL || "");
}

export default function StoreBadge({ locale, place, className = "" }) {
  if (!storeLive()) return null;
  const ar = locale === "ar";
  const href = `https://apps.microsoft.com/detail/${STORE_ID}?referrer=appbadge&cid=website-${place}&mode=full`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-track="course_store_click"
      data-track-place={place}
      className={`inline-block rounded-[10px] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size vector badge, nothing to optimise */}
      <img
        src={ar ? "/badges/ms-store-ar-light.svg" : "/badges/ms-store-en-light.svg"}
        alt={ar ? "نزّله من Microsoft Store" : "Get it from Microsoft"}
        width={200}
        height={55}
        className="h-auto w-[200px]"
      />
    </a>
  );
}
