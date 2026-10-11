import en from "./en.json";

// One locale by default. To add one:
//   1. add it to `locales` here and in astro.config.mjs `i18n.locales`
//   2. add src/i18n/<code>.json with every key from en.json
//   3. add its hreflang and og:locale below
// Pages live under src/pages/[...lang]/, so the default locale has no URL
// prefix and every other locale gets one (/de/contact). Nothing else changes.
export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const HREFLANG: Record<Locale, string> = { en: "en" };
export const OG_LOCALE: Record<Locale, string> = { en: "en_US" };

const messages: Record<Locale, Record<string, string>> = { en };

/** Translate a key, filling {placeholders}. Falls back to the default locale. */
export function t(
  locale: Locale,
  key: keyof typeof en,
  values: Record<string, string | number> = {},
) {
  const template = messages[locale][key] ?? messages[defaultLocale][key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, name) =>
    String(values[name] ?? `{${name}}`),
  );
}

/** The `lang` route param for a locale: undefined for the unprefixed default. */
export function langParam(locale: Locale): string | undefined {
  return locale === defaultLocale ? undefined : locale;
}

export function localeFromParam(param: string | undefined): Locale {
  return (locales as readonly string[]).includes(param ?? "")
    ? (param as Locale)
    : defaultLocale;
}

/** Locale-prefixed path for a locale-relative one ("/contact", "/"). */
export function localePath(locale: Locale, path: string): string {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  return path === "/" ? prefix || "/" : `${prefix}${path}`;
}

/** getStaticPaths entries for one page in every locale. */
export function localeStaticPaths() {
  return locales.map((locale) => ({
    params: { lang: langParam(locale) },
    props: { locale },
  }));
}
