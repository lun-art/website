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
  footerMotto?: string;
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

export type Home = {
  titleLine1: string;
  titleLine2?: string;
  intro: string;
  aboutBlocks?: Array<{ _key: string; title: string; text: string }>;
  seoDescription?: string;
  seoImage?: SanityImage;
};

export type ArtistSummary = { _id: string; name: string; slug: string };

export type Artist = ArtistSummary & {
  workTitle?: string;
  website?: string;
  statement?: string;
  works?: Array<SanityImage & { _key: string }>;
  seoDescription?: string;
};

export function sanityConfig() {
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = import.meta.env.PUBLIC_SANITY_DATASET;
  return projectId && dataset ? { projectId, dataset } : null;
}

let client: SanityClient | undefined;
let seed: Promise<unknown[]> | undefined;

/**
 * Local and CI only: with no Sanity project configured, SANITY_SEED_FILE
 * points at an NDJSON export (sanity/seed/content.ndjson) and queries run
 * against it with groq-js, so the site builds with real content before the
 * project exists. Production builds always read Sanity.
 */
function seedFile(): string | undefined {
  return import.meta.env.SANITY_SEED_FILE || process.env.SANITY_SEED_FILE;
}

async function loadSeed(path: string) {
  const { readFile } = await import("node:fs/promises");
  const text = await readFile(path, "utf8");
  // Published documents only, like the site's unauthenticated reads.
  return text
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as { _id: string })
    .filter((doc) => !doc._id.startsWith("drafts."));
}

async function seedFetch<T>(
  path: string,
  query: string,
  params: Record<string, unknown>,
) {
  const { parse, evaluate } = await import("groq-js");
  seed ??= loadSeed(path);
  const result = await evaluate(parse(query, { params }), {
    dataset: await seed,
    params,
  });
  return (await result.get()) as T;
}

/**
 * Run a GROQ query at build time. Returns null while Sanity isn't configured
 * (and no seed file is set), so an unprovisioned site still builds. A
 * configured project that fails fails the build: a deploy must never silently
 * drop content.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T | null> {
  const config = sanityConfig();
  if (!config) {
    const path = seedFile();
    return path ? seedFetch<T>(path, query, params) : null;
  }
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

export const siteSettingsQuery = `*[_id == "siteSettings"][0]{siteName, tagline, description, logo, defaultSeoImage, contactEmail, footerMotto, socialLinks}`;
export const homeQuery = `*[_id == "home"][0]{titleLine1, titleLine2, intro, aboutBlocks, seoDescription, seoImage}`;
// Case-insensitive, so "ouchhh" files under O.
const artistOrder = `order(lower(name) asc)`;
export const artistListQuery = `*[_type == "artist" && defined(slug.current)] | ${artistOrder}{_id, name, "slug": slug.current}`;
export const artistsQuery = `*[_type == "artist" && defined(slug.current)] | ${artistOrder}{_id, name, "slug": slug.current, workTitle, website, statement, works, seoDescription}`;
export const pageBySlugQuery = `*[_type == "page" && slug.current == $slug][0]{_id, title, "slug": slug.current, body, seoDescription, seoImage, _updatedAt}`;
export const pagesQuery = `*[_type == "page" && defined(slug.current) && slug.current != "home"]{_id, title, "slug": slug.current, body, seoDescription, seoImage, _updatedAt, showInNav, navOrder}`;
export const navPagesQuery = `*[_type == "page" && showInNav == true && slug.current != "home"] | order(navOrder asc){title, "slug": slug.current}`;
