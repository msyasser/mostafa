import Script from "next/script";

export default function SEOOptimizer({
  type = "website",
  title,
  description,
  url,
  image,
  locale = "en",
  templateData = null,
  blogData = null,
  courseData = null
}) {
  const isArabic = locale === "ar";

  // Base structured data for organization
  const organizationData = {
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
  };

  // Course-specific structured data
  const courseStructuredData = courseData ? {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": title || courseData.name,
    "description": description || courseData.description,
    "provider": {
      "@type": "Person",
      "name": isArabic ? courseData.instructor_ar || "مصطفى ياسر" : courseData.instructor || "Mostafa Yasser",
      "sameAs": "https://www.mostafayasser.com"
    },
    "instructor": {
      "@type": "Person",
      "name": isArabic ? courseData.instructor_ar || "مصطفى ياسر" : courseData.instructor || "Mostafa Yasser"
    },
    "inLanguage": isArabic ? "ar" : "en",
    "image": image,
    "url": url,
    "educationalLevel": isArabic ? courseData.level_ar || "مبتدئ إلى متقدم" : courseData.level || "Beginner to Advanced",
    "offers": {
      "@type": "Offer",
      "price": courseData.price ? String(courseData.price) : "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "category": courseData.premium ? "Paid" : "Free"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Online",
      "courseWorkload": isArabic ? courseData.duration_ar : courseData.duration
    }
  } : null;

  // Template-specific structured data
  const templateStructuredData = templateData ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": templateData.name,
    "description": templateData.description,
    "url": url,
    "image": image,
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": templateData.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "creator": {
      "@type": "Person",
      "name": "Mostafa Yasser"
    }
  } : null;

  // Blog-specific structured data
  const blogStructuredData = blogData ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": image,
    "url": url,
    "author": {
      "@type": "Person",
      "name": "Mostafa Yasser"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Mostafa Yasser",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.mostafayasser.com/icon.png"
      }
    },
    "datePublished": blogData.publishedAt || new Date().toISOString(),
    "dateModified": blogData.updatedAt || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  } : null;

  // Website structured data
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Mostafa Yasser - Notion Templates",
    "description": description,
    "url": "https://www.mostafayasser.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.mostafayasser.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": isArabic ? "الرئيسية" : "Home",
        "item": `https://www.mostafayasser.com/${locale}`
      }
    ]
  };

  // Add course, template or blog specific breadcrumbs
  if (courseData) {
    breadcrumbData.itemListElement.push(
      {
        "@type": "ListItem",
        "position": 2,
        "name": isArabic ? "الدورات التدريبية" : "Courses",
        "item": `https://courses.mostafayasser.com/${locale}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": url
      }
    );
  } else if (templateData) {
    breadcrumbData.itemListElement.push(
      {
        "@type": "ListItem",
        "position": 2,
        "name": isArabic ? "القوالب" : "Templates",
        "item": `https://www.mostafayasser.com/${locale}/templates`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": templateData.name,
        "item": url
      }
    );
  } else if (blogData) {
    breadcrumbData.itemListElement.push(
      {
        "@type": "ListItem",
        "position": 2,
        "name": isArabic ? "المدونة" : "Blog",
        "item": `https://www.mostafayasser.com/${locale}/blogs`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": url
      }
    );
  }

  return (
    <>
      {/* Organization structured data */}
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />

      {/* Website structured data */}
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData)
        }}
      />

      {/* Breadcrumb structured data */}
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />

      {/* Course-specific structured data */}
      {courseStructuredData && (
        <Script
          id="course-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(courseStructuredData)
          }}
        />
      )}

      {/* Template-specific structured data */}
      {templateStructuredData && (
        <Script
          id="template-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(templateStructuredData)
          }}
        />
      )}

      {/* Blog-specific structured data */}
      {blogStructuredData && (
        <Script
          id="blog-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogStructuredData)
          }}
        />
      )}
    </>
  );
}
