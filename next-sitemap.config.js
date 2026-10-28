/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.mostafayasser.com",
  generateRobotsTxt: false, // public/robots.txt is maintained by hand
  generateIndexSitemap: true, // Enable index sitemap for better organization
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,

  // Real pages (blog posts, templates, tools, courses, ...) are discovered from the
  // Next.js build output, so they are not listed by hand here: a hand-written list
  // drifts from the content and ends up advertising URLs that return "Page Not Found".
  // Keep pages that shouldn't be indexed out of the sitemap.
  exclude: ["/*/auth/*", "/*/profile", "/api/*", "/embed/*", "/robots.txt"],

  // Pages the build output doesn't expose (they are rendered on demand, not prerendered),
  // so auto-discovery misses them. Keep this list to those index pages only.
  additionalPaths: async (config) => {
    const pages = ["", "services", "consultation", "courses", "tools", "blog", "privacy-policy", "terms-of-service"];
    return Promise.all(
      ["en", "ar"].flatMap((locale) =>
        pages.map((page) => config.transform(config, `/${locale}${page ? "/" + page : ""}`))
      )
    );
  },

  transform: async (config, path) => {
    // "/" permanently redirects to /en, so only the locale roots belong in the sitemap
    if (path === "/") return null;

    let priority = config.priority;
    let changefreq = config.changefreq;

    if (/^\/(en|ar)$/.test(path)) {
      priority = 1.0;
      changefreq = "daily";
    } else if (/^\/(en|ar)\/(templates|courses)(\/|$)/.test(path)) {
      priority = 0.9;
    } else if (/^\/(en|ar)\/(privacy-policy|terms-of-service)$/.test(path)) {
      priority = 0.5;
      changefreq = "yearly";
    } else if (/^\/(en|ar)\/(about|contact)$/.test(path)) {
      changefreq = "monthly";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
