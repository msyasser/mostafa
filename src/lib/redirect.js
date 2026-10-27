// Hosts we're willing to send a user to after sign-in. Compare the parsed hostname
// exactly: a suffix check on the raw string would also accept evilmostafayasser.com.
export function isAllowedRedirectHost(hostname) {
  if (hostname === "mostafayasser.com" || hostname.endsWith(".mostafayasser.com")) {
    return true;
  }
  // Vercel domains of this project/team only (production alias, previews, branch URLs)
  if (hostname === "mostafa-sigma.vercel.app") return true;
  if (/^mostafa(-[a-z0-9]+)*-engmsyasser\.vercel\.app$/.test(hostname)) return true;
  if (process.env.NODE_ENV !== "production" && hostname === "localhost") return true;
  return false;
}

export function isSameSitePath(url) {
  return typeof url === "string" && url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/\\");
}

// callbackUrl comes from the query string, so it can't be trusted. Returns a
// same-site path (e.g. "/en/profile") or an allowed absolute URL, otherwise the
// locale home page.
export function getSafeCallbackUrl(raw, locale) {
  const fallback = `/${locale}`;
  if (typeof raw !== "string" || !raw) return fallback;
  if (isSameSitePath(raw)) return raw;

  try {
    const parsed = new URL(raw);
    const isLocalDev = process.env.NODE_ENV !== "production" && parsed.hostname === "localhost";
    if (
      (parsed.protocol === "https:" || (isLocalDev && parsed.protocol === "http:")) &&
      isAllowedRedirectHost(parsed.hostname)
    ) {
      return raw;
    }
  } catch {
    // malformed URL
  }
  return fallback;
}
