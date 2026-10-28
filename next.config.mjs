import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const EMBED_FRAME_ANCESTORS = "*";
const SITE_FRAME_ANCESTORS = "'self' https://*.mostafayasser.com";
// Template product pages are embedded in the Notion template pages (upsell
// block at the bottom of the free templates), so Notion may frame them.
const NOTION_FRAME_ANCESTORS = `${SITE_FRAME_ANCESTORS} https://www.notion.so https://notion.so https://*.notion.site https://www.notion.com https://*.notion.com`;

const FRAME_SRC = "'self' https://www.notion.so https://notion.so https://mostafayasser.notion.site https://www.youtube.com https://youtube.com https://app.fillout.com https://fillout.com https://embed.fillout.com https://calendar.google.com https://calendar.notion.com https://cal.com https://app.cal.com https://*.cal.com https://vercel.live";
const SCRIPT_HOSTS = "https://www.googletagmanager.com https://www.google-analytics.com https://app.fillout.com https://fillout.com https://embed.fillout.com https://calendar.google.com https://calendar.notion.com https://cal.com https://app.cal.com https://*.cal.com https://vercel.live https://vercel.com";
const CONNECT_SRC = "'self' https://www.google-analytics.com https://app.fillout.com https://fillout.com https://embed.fillout.com https://calendar.google.com https://calendar.notion.com https://cal.com https://app.cal.com https://*.cal.com https://api.opencagedata.com https://api.aladhan.com https://nominatim.openstreetmap.org https://api.coingecko.com https://api.open-meteo.com https://vercel.live https://vercel.com https://api.alquran.cloud";

function buildCsp({ frameAncestors, allowEval }) {
  return [
    `frame-ancestors ${frameAncestors}`,
    "object-src 'none'",
    "base-uri 'self'",
    `frame-src ${FRAME_SRC}`,
    `script-src 'self' 'unsafe-inline'${allowEval ? " 'unsafe-eval'" : ''} ${SCRIPT_HOSTS}`,
    `connect-src ${CONNECT_SRC}`,
  ].join('; ') + ';';
}

// The enforced policy still allows 'unsafe-eval' so nothing that works today breaks.
// The report-only copy drops it: browsers log would-be violations to the console
// without blocking, so 'unsafe-eval' can be removed once the console stays clean.
function cspHeaders(frameAncestors) {
  return [
    {
      key: 'Content-Security-Policy',
      value: buildCsp({ frameAncestors, allowEval: true }),
    },
    {
      key: 'Content-Security-Policy-Report-Only',
      value: buildCsp({ frameAncestors, allowEval: false }),
    },
  ];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Don't include i18n manually here; let next-intl handle it

  // Fix workspace root warning
  outputFileTracingRoot: process.cwd(),

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Bundle optimization
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-icons', 'lucide-react'],
  },



  // Image optimization
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [25, 50, 75, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
    ],
  },

  // Headers for better SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=()',
          },
        ],
      },
      // The /embed widgets are meant to be iframed from anywhere (Notion pages),
      // so they keep frame-ancestors *.
      {
        source: '/embed/:path*',
        headers: cspHeaders(EMBED_FRAME_ANCESTORS),
      },
      // Every other page may only be framed by this site and its subdomains,
      // which prevents clickjacking on sign-in, profile and checkout pages.
      {
        source: '/:path((?!embed/).*)',
        headers: cspHeaders(SITE_FRAME_ANCESTORS),
      },
      // Listed after the rule above so these headers override it: only the
      // public template detail pages (/en|ar/templates/<slug>) may be framed
      // by Notion.
      {
        source: '/:locale(en|ar)/templates/:slug',
        headers: cspHeaders(NOTION_FRAME_ANCESTORS),
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache static assets
      {
        source: '/public/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, s-maxage=2592000',
          },
        ],
      },
    ];
  },

  // Essential path-based redirects
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/en/privacy-policy",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        destination: "/en/terms-of-service",
        permanent: true,
      },
      {
        source: "/templates",
        destination: "/en/templates",
        permanent: true,
      },
      {
        source: "/ramadan-competition",
        destination: "/en/templates/ramadan-competition",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(withBundleAnalyzer(nextConfig));
