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

  // Base structured data for organization & brand
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mostafa Yasser",
    "alternateName": isArabic ? "مصطفى ياسر" : "Mostafa Yasser",
    "jobTitle": isArabic ? "متخصص ومطور أنظمة نوشن" : "Notion Specialist & Digital Architect",
    "url": "https://www.mostafayasser.com",
    "image": "https://www.mostafayasser.com/icon.png",
    "description": isArabic
      ? "يقدم مصطفى ياسر قوالب نوشن احترافية مصممة لتعزيز الإنتاجية وتنظيم سير العمل، وأنظمة مخصصة لإدارة المشاريع والمهام والماليات، بالإضافة إلى مصادر تعليمية لبناء أنظمتك الخاصة."
      : "Mostafa Yasser offers beautifully crafted Notion templates designed to boost productivity and streamline workflows. Services include custom systems to organize projects, tasks, and finances, as well as resources to help users build their own systems.",
    "sameAs": [
      "https://twitter.com/engmsyasser",
      "https://www.youtube.com/@engmsyasser"
    ],
    "knowsAbout": [
      "Notion",
      "Notion Templates",
      "Custom Notion Systems",
      "Productivity Workflows",
      "Project Management Systems",
      "Task Management",
      "Financial Tracking Systems"
    ],
    "areaServed": [
      {
        "@type": "Country",
        "name": "Egypt"
      },
      {
        "@type": "Country",
        "name": "Saudi Arabia"
      },
      {
        "@type": "Country",
        "name": "United States"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": isArabic ? "خدمات ومنتجات مصطفى ياسر" : "Mostafa Yasser Services & Products",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isArabic ? "أنظمة نوشن مخصصة" : "Custom Notion systems",
            "description": isArabic
              ? "تصميم وبناء أنظمة مخصصة لإدارة المشاريع، والمهام، والماليات."
              : "Custom systems designed to organize projects, tasks, and finances."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": isArabic ? "قوالب نوشن جاهزة للاستخدام" : "Ready-to-use Notion templates",
            "description": isArabic
              ? "قوالب نوشن مصممة بعناية لتعزيز الإنتاجية وتنظيم سير العمل فورياً."
              : "Beautifully crafted Notion templates designed to boost productivity and streamline workflows."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isArabic ? "مصادر تعليمية وشروحات الإنتاجية" : "Productivity resources and tutorials",
            "description": isArabic
              ? "شروحات ومصادر لمساعدة المستخدمين على بناء وتطوير أنظمتهم الخاصة في نوشن."
              : "Tutorials and productivity resources to help users build and optimize their own Notion systems."
          }
        }
      ]
    },
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
