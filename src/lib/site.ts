import type { SanityImage, SiteSettings } from "./sanity";
import { sanityFetch, siteSettingsQuery, urlFor } from "./sanity";

// Replaced by the CMS site name once Site settings is published.
export const PLACEHOLDER_SITE_NAME = "[SITE NAME]";
export const TALASI_URL = "https://talasi.me";
/**
 * Committed fallbacks, so every page has a link preview and the logo in
 * structured data resolves before the CMS has images. og.png is 1200×630;
 * replace it at scaffold time with scripts/og-image.mjs.
 */
export const DEFAULT_SOCIAL_IMAGE = "/og.png";
export const DEFAULT_LOGO = "/apple-touch-icon.png";

let settings: Promise<SiteSettings | null> | undefined;

/** Site settings, fetched once per build. */
export function getSiteSettings() {
  settings ??= sanityFetch<SiteSettings>(siteSettingsQuery);
  return settings;
}

export function siteNameOf(s: SiteSettings | null | undefined) {
  return s?.siteName || PLACEHOLDER_SITE_NAME;
}

/**
 * "Page | Site". The homepage has no page title: "Site | Tagline", or the site
 * name alone without a tagline.
 */
export function titleFor(
  pageTitle: string | undefined,
  siteName: string,
  tagline?: string,
) {
  if (pageTitle) return `${pageTitle} | ${siteName}`;
  return tagline ? `${siteName} | ${tagline}` : siteName;
}

export function socialImageUrl(image: SanityImage | undefined) {
  return image?.asset ? urlFor(image).width(1200).height(630).url() : undefined;
}

/**
 * The first CMS image that is set, sized for link previews, or the committed
 * fallback. Always an absolute URL; alt is the image's own alt text, if any.
 */
export function socialImageFor(
  siteUrl: string,
  ...images: Array<SanityImage | undefined>
): { url: string; alt?: string } {
  for (const image of images) {
    const url = socialImageUrl(image);
    if (url) return { url, alt: image?.alt };
  }
  return { url: new URL(DEFAULT_SOCIAL_IMAGE, siteUrl).href };
}

/** Organization structured data, omitting fields with no real value. */
export function organizationJsonLd(s: SiteSettings | null, siteUrl: string) {
  const logo = s?.logo?.asset
    ? urlFor(s.logo).width(512).height(512).fit("max").url()
    : new URL(DEFAULT_LOGO, siteUrl).href;
  const sameAs = s?.socialLinks
    ?.map((l) => l.url)
    .filter((u): u is string => Boolean(u));
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteNameOf(s),
    url: siteUrl,
    logo,
    ...(s?.description && { description: s.description }),
    ...(s?.contactEmail && { email: s.contactEmail }),
    ...(sameAs?.length && { sameAs }),
  };
}

/** WebSite structured data for the homepage: Google takes the site name in results from it. */
export function websiteJsonLd(siteName: string, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
  };
}

/** JSON for an inline <script type="application/ld+json">, safe from "</script>". */
export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * A search description from free text: whitespace collapsed, cut at a word
 * boundary to fit `max` characters with an ellipsis.
 */
export function excerpt(text: string, max = 155) {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max / 2 ? cut.slice(0, space) : cut).replace(/[\s,.;:]+$/, "")}…`;
}
