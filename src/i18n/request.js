import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: {
      HomePage: (await import(`../../messages/${locale}/HomePage.json`))
        .default,
      TemplatesPage: (
        await import(`../../messages/${locale}/TemplatesPage.json`)
      ).default,
      CoursesPage: (await import(`../../messages/${locale}/CoursesPage.json`))
        .default,
      BlogsPage: (await import(`../../messages/${locale}/BlogsPage.json`))
        .default,
      ContactPage: (await import(`../../messages/${locale}/ContactPage.json`))
        .default,
      AboutPage: (await import(`../../messages/${locale}/AboutPage.json`))
        .default,
      PrivacyPage: (await import(`../../messages/${locale}/PrivacyPage.json`))
        .default,
      TermsPage: (await import(`../../messages/${locale}/TermsPage.json`))
        .default,
      Subscription: (await import(`../../messages/${locale}/Subscription.json`))
        .default,
      TemplateSlug: (await import(`../../messages/${locale}/TemplateSlug.json`))
        .default,
      BlogSlug: (await import(`../../messages/${locale}/BlogSlug.json`))
        .default,
      Navigation: (await import(`../../messages/${locale}/Navigation.json`))
        .default,
      FloatingNav: (await import(`../../messages/${locale}/FloatingNav.json`))
        .default,
      TemplatesShowcase: (
        await import(`../../messages/${locale}/TemplatesShowcase.json`)
      ).default,
      Footer: (await import(`../../messages/${locale}/Footer.json`)).default,
      Categories: (await import(`../../messages/${locale}/Categories.json`))
        .default,
      NotFound: (await import(`../../messages/${locale}/NotFound.json`))
        .default,
      Auth: (await import(`../../messages/${locale}/Auth.json`)).default,
    },
  };
});
