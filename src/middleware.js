import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

// Map subdomains to their internal path
const SUBDOMAIN_MAP = {
  templates: "templates",
  courses: "courses",
};

export default function middleware(request) {
  const hostname = request.headers.get("host") || "";

  // Extract subdomain (e.g. "templates" from "templates.mostafayasser.com")
  const subdomain = hostname.split(".")[0];
  const section = SUBDOMAIN_MAP[subdomain];

  if (section) {
    const { pathname, search } = request.nextUrl;

    // Detect locale prefix from path (e.g. /ar/... or /en/...)
    const localeMatch = pathname.match(/^\/(en|ar)(\/.*)?$/);
    const locale = localeMatch ? localeMatch[1] : "en";
    const rest = localeMatch ? localeMatch[2] || "" : pathname;

    // Avoid infinite rewrite loops — already pointing to the section
    if (rest.startsWith(`/${section}`)) {
      return intlMiddleware(request);
    }

    // Shared routes (auth, api, legal) should not be rewritten into /[locale]/[section]/...
    if (
      rest.startsWith("/auth") ||
      rest.startsWith("/api") ||
      rest.startsWith("/privacy-policy") ||
      rest.startsWith("/terms-of-service")
    ) {
      return intlMiddleware(request);
    }

    // Set locale headers for next-intl
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-next-intl-locale", locale);

    // Rewrite: templates.mostafayasser.com/ar → /ar/templates
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/${locale}/${section}${rest}`;
    
    const response = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set("x-next-intl-locale", locale);
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|embed|.*\\..*).*)",
  ],
};
