// @ts-check
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const { PUBLIC_SITE_URL } = loadEnv(
  process.env.NODE_ENV ?? "",
  process.cwd(),
  "",
);

// Fully static: every page is built from Sanity at build time and served as a
// Workers static asset, which costs no Worker CPU and fits the free plan. A
// Sanity publish calls a Workers Builds deploy hook to rebuild (SETUP.md).
export default defineConfig({
  site: PUBLIC_SITE_URL || "http://localhost:4321",
  output: "static",
  trailingSlash: "never",
  build: { format: "file" },
  // The 404 and contact result pages stay out of the sitemap.
  integrations: [
    sitemap({
      filter: (page) =>
        !/\/(404|contact\/(sent|error))$/.test(new URL(page).pathname),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  // One locale by default. To add one, see src/i18n/index.ts.
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
    routing: { prefixDefaultLocale: false },
  },
});
