import { Oswald, Tajawal } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/src/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import Navigation from "@/src/app/[locale]/_components/Navigation";
import Footer from "@/src/app/[locale]/_components/Footer";
import PerformanceMonitor from "@/src/app/[locale]/_components/PerformanceMonitor";
import AuthProvider from "@/src/app/[locale]/_components/AuthProvider";
import "@/src/app/[locale]/_styles/globals.css";
import Script from "next/script";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const siteUrl = "https://www.mostafayasser.com";
  const imageUrl = `${siteUrl}/icon.png`;

  return {
    title: {
      template: isArabic ? "%s | مصطفى ياسر" : "%s | Mostafa Yasser",
      default: isArabic
        ? "مصطفى ياسر | قوالب نوشن لتنظيم حياتك"
        : "Mostafa Yasser | Notion Templates to Organize Your Life",
    },
    description: isArabic
      ? "استكشف قوالب نوشن المصممة بعناية لتعزيز الإنتاجية وتنظيم سير عملك وجعل حياتك أكثر وضوحًا. من تصميم مصطفى ياسر."
      : "Explore beautifully crafted Notion templates designed to boost productivity, streamline your workflow, and bring clarity to your life. Created by Mostafa Yasser.",
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        ar: `${siteUrl}/ar`,
      },
    },
    openGraph: {
      title: isArabic
        ? "مصطفى ياسر | قوالب نوشن لتنظيم حياتك"
        : "Mostafa Yasser | Notion Templates to Organize Your Life",
      description: isArabic
        ? "عزز إنتاجيتك مع قوالب نوشن الاحترافية من مصطفى ياسر. بسيطة وفعالة وجميلة."
        : "Boost your productivity with premium Notion templates by Mostafa Yasser. Simple, effective, and beautifully designed.",
      url: `${siteUrl}/${locale}`,
      siteName: "Mostafa Yasser",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: isArabic
            ? "مصطفى ياسر - قوالب نوشن"
            : "Mostafa Yasser - Notion Templates",
        },
      ],
      locale: isArabic ? "ar_EG" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic
        ? "مصطفى ياسر | قوالب نوشن"
        : "Mostafa Yasser | Notion Templates",
      description: isArabic
        ? "اكتشف قوالب نوشن لتنظيم حياتك وزيادة إنتاجيتك. من تصميم مصطفى ياسر."
        : "Discover Notion templates that organize your life and boost productivity. Built by Mostafa Yasser.",
      creator: "@engmsyasser",
      images: [imageUrl],
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const isArabic = locale === "ar";

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      dir={dir}
      className={locale === "ar" ? tajawal.className : oswald.className}
      suppressHydrationWarning={true}
    >
      <head>
        <meta
          name="google-site-verification"
          content="SKiO5RTFyP9KeXKJAJ14FVn-qZUFpXut8_41TWNG_9o"
        />
        {/* Google Analytics Script - Optimized */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BPZ882BE5Y"
          strategy="lazyOnload"
        />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BPZ882BE5Y', {
              page_load_time: true,
              custom_map: {'custom_parameter': 'value'}
            });
          `}
        </Script>

        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Mostafa Yasser",
              "url": "https://www.mostafayasser.com",
              "logo": "https://www.mostafayasser.com/icon.png",
              "description": isArabic
                ? "قوالب نوشن لتنظيم حياتك وزيادة إنتاجيتك"
                : "Notion templates to organize your life and boost productivity",
              "sameAs": [
                "https://twitter.com/engmsyasser"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["English", "Arabic"]
              }
            })
          }}
        />
      </head>
      <body
        className="bg-black text-white min-h-screen flex flex-col"
        cz-shortcut-listen="true"
        data-testim-main-word-scripts-loaded="true"
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <PerformanceMonitor />
            <Navigation />
            <main className="flex-1 px-2 sm:px-8 pt-26">{children}</main>
            <Footer />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
