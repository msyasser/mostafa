import TemplateDetailsClient from "./TemplateDetailsClient";
import templatesData from "@/src/app/[locale]/_data/templatesData";
import { notFound } from "next/navigation";
import { createTranslator } from "next-intl";
import arMessages from "@/messages/ar/TemplateSlug.json";
import enMessages from "@/messages/en/TemplateSlug.json";
import PremiumPage from "./PremiumPage";

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const messages = locale === "ar" ? arMessages : enMessages;
  const t = createTranslator({ locale, messages });
  const template = templatesData.find((b) => b.slug === slug);

  if (!template) return {};

  const title = locale === "ar"
    ? `${t(`${template.name}.name`)} | قالب نوشن من مصطفى ياسر`
    : `${t(`${template.name}.name`)} | Notion Template by Mostafa Yasser`;

  const description = locale === "ar"
    ? t(`${template.name}.description`) ??
    "اكتشف قالب نوشن مصمم بعناية لتحسين إنتاجيتك وتنظيم حياتك الرقمية."
    : "Discover a Notion template carefully designed to improve your productivity and organize your digital life.";

  const url = `https://www.mostafayasser.com/${locale}/templates/${slug}`;

  const rawImage = t(`${template.name}.image`);
  const imageUrl = rawImage.startsWith("http")
    ? rawImage
    : `https://www.mostafayasser.com${rawImage}`;

  // ✅ Determine favicon per template
  let faviconPath = "/favicons/icon.webp"; // Default favicon for common templates

  if (slug === "study-hub") {
    faviconPath = "/favicons/study-hub.webp";
  } else if (slug === "second-brain") {
    faviconPath = "/favicons/second-brain.webp";
  } else if (slug === "second-brain-muslim-edition") {
    faviconPath = "/favicons/second-brain.webp";
  } else if (slug === "finance-hub") {
    faviconPath = "/favicons/finance-hub.webp";
  } else if (slug === "quranhub") {
    faviconPath = "/favicons/quran-tracker.webp";
  } else if (slug === "ibadat-hub") {
    faviconPath = "/favicons/ibadat-hub.webp";
  }

  return {
    title,
    description,
    keywords: locale === "ar"
      ? [
        t(`${template.name}.name`),
        "قالب نوشن",
        "نوشن إنتاجية",
        "تنظيم رقمي",
        "مصطفى ياسر",
      ]
      : [
        t(`${template.name}.name`),
        "Notion template",
        "Notion productivity",
        "Digital organization",
        "Mostafa Yasser",
      ],
    openGraph: {
      title,
      description,
      url,
      siteName: "Mostafa Yasser",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: locale === "ar"
            ? `معاينة قالب ${t(`${template.name}.name`)}`
            : `Preview of ${t(`${template.name}.name`)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    icons: {
      icon: faviconPath,
    },
    alternates: {
      canonical: url,
    },
    other: {
      "google-site-verification": "SKiO5RTFyP9KeXKJAJ14FVn-qZUFpXut8_41TWNG_9o",
    },
  };
}

export async function generateStaticParams() {
  const locales = ["en", "ar"];

  return templatesData.flatMap((template) =>
    locales.map((locale) => ({
      locale,
      slug: template.slug,
    }))
  );
}

export default async function TemplateDetails({ params }) {
  const { slug } = await params;
  const template = templatesData.find((b) => b.slug === slug);

  if (!template) {
    return notFound();
  }

  if (
    template.slug === "study-hub" ||
    template.slug === "second-brain" ||
    template.slug === "second-brain-muslim-edition" ||
    template.slug === "finance-hub" ||
    template.slug === "quranhub" ||
    template.slug === "ibadat-hub"
  ) {
    return <PremiumPage template={template} />;
  }

  return <TemplateDetailsClient template={template} />;
}
