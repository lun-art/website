#!/usr/bin/env node
// Builds sanity/seed/content.ndjson from sanity/seed/documents.json (site
// settings and the home page) and sanity/seed/artists.csv (the old Google
// Sheet, exported on 2026-10-11).
//
// The NDJSON is what `sanity dataset import` loads into the new project, and
// what local builds and CI read through SANITY_SEED_FILE before a project
// exists. Once the content is in Sanity, Sanity is the source of truth and
// this seed is only for fresh datasets.
//
//   node scripts/build-seed.mjs
//   npx sanity dataset import sanity/seed/content.ndjson <dataset>
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { artistFromRow, parseCsv } from "./lib/artists.mjs";

const SEED = "sanity/seed";
// Sanity sets these on import; the seed carries them so local builds see the
// same fields.
const SEED_DATE = "2026-10-11T00:00:00Z";

const documents = JSON.parse(
  await readFile(join(SEED, "documents.json"), "utf8"),
);
const artists = parseCsv(await readFile(join(SEED, "artists.csv"), "utf8")).map(
  artistFromRow,
);

const slugs = new Set();
for (const { slug } of artists) {
  if (slugs.has(slug.current))
    throw new Error(`duplicate slug ${slug.current}`);
  slugs.add(slug.current);
}

const out = [...documents, ...artists].map((doc) => ({
  _createdAt: SEED_DATE,
  _updatedAt: SEED_DATE,
  ...doc,
}));

await writeFile(
  join(SEED, "content.ndjson"),
  out.map((doc) => JSON.stringify(doc)).join("\n") + "\n",
);
console.log(`${out.length} documents (${artists.length} artists)`);
