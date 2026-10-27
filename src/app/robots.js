// Served at /robots.txt. This can't live in public/ because /public/robots.txt is
// gitignored (next-sitemap used to generate it), which left the site without one.
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/en/auth/", "/ar/auth/", "/en/profile", "/ar/profile"],
      },
    ],
    sitemap: "https://www.mostafayasser.com/sitemap.xml",
  };
}
