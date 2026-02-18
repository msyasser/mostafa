import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin({
  // This should point to the request configuration
  requestConfig: './src/i18n/request.js'
});

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

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

  // Webpack optimization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          animations: {
            test: /[\/\\]node_modules[\/\\](framer-motion|gsap)[\/\\]/,
            name: 'animations',
            chunks: 'all',
            priority: 20,
          },
          icons: {
            test: /[\/\\]node_modules[\/\\](react-icons|lucide-react|@heroicons)[\/\\]/,
            name: 'icons',
            chunks: 'all',
            priority: 15,
          },
          vendor: {
            test: /[\/\\]node_modules[\/\\]/,
            name: 'vendor',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }
    return config;
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
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://www.notion.so https://notion.so; frame-src 'self' https://www.notion.so https://notion.so https://mostafayasser.notion.site https://www.youtube.com https://youtube.com https://app.fillout.com https://fillout.com https://embed.fillout.com https://calendar.google.com https://calendar.notion.so https://vercel.live; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://app.fillout.com https://fillout.com https://embed.fillout.com https://calendar.google.com https://calendar.notion.so https://vercel.live https://vercel.com; connect-src 'self' https://www.google-analytics.com https://app.fillout.com https://fillout.com https://embed.fillout.com https://calendar.google.com https://calendar.notion.so https://api.opencagedata.com https://api.aladhan.com https://nominatim.openstreetmap.org https://api.coingecko.com https://api.open-meteo.com https://vercel.live https://vercel.com https://api.alquran.cloud;",
          },
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
        ],
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
