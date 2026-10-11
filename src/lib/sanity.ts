import { createClient, type SanityClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

export const apiVersion = "2026-09-30";

export type SanityImage = { asset?: { _ref: string }; alt?: string };

export type SiteSettings = {
  siteName?: string;
  tagline?: string;
  description?: string;
  logo?: SanityImage;
  defaultSeoImage?: SanityImage;
  contactEmail?: string;
  socialLinks?: Array<{ _key: string; label?: string; url?: string }>;
};

export type Page = {
  _id: string;
  title: string;
  slug: string;
  body?: unknown[];
  seoDescription?: string;
  seoImage?: SanityImage;
  _updatedAt: string;
};

export function sanityConfig() {
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = import.meta.env.PUBLIC_SANITY_DATASET;
  return projectId && dataset ? { projectId, dataset } : null;
}

let client: SanityClient | undefined;

/**
 * Run a GROQ query at build time. Returns null while Sanity isn't configured,
 * so an unprovisioned template still builds. A configured project that fails
 * fails the build: a deploy must never silently drop content.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
) {
  const config = sanityConfig();
  if (!config) return null;
  // No CDN: builds should see a publish immediately, not a cached copy.
  client ??= createClient({ ...config, apiVersion, useCdn: false });
  return client.fetch<T>(query, params);
}

/** Sanity CDN URL builder. Size every image here; nothing transforms at request time. */
export function urlFor(image: SanityImage) {
  const config = sanityConfig();
  if (!config) throw new Error("Sanity is not configured");
  return createImageUrlBuilder(config).image(image).auto("format");
}

export const siteSettingsQuery = `*[_id == "siteSettings"][0]{siteName, tagline, description, logo, defaultSeoImage, contactEmail, socialLinks}`;
export const pageBySlugQuery = `*[_type == "page" && slug.current == $slug][0]{_id, title, "slug": slug.current, body, seoDescription, seoImage, _updatedAt}`;
export const pagesQuery = `*[_type == "page" && defined(slug.current) && slug.current != "home"]{_id, title, "slug": slug.current, body, seoDescription, seoImage, _updatedAt, showInNav, navOrder}`;
export const navPagesQuery = `*[_type == "page" && showInNav == true && slug.current != "home"] | order(navOrder asc){title, "slug": slug.current}`;
