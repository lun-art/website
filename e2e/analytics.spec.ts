import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

// CI builds with PUBLIC_POSTHOG_KEY blanked. A local build of a site that has
// its key set in .env.production skips this check.
const keySet = Boolean(
  process.env.PUBLIC_POSTHOG_KEY ??
  /^PUBLIC_POSTHOG_KEY=[ \t]*["']?[^\s#"']/m.test(
    readFileSync(".env.production", "utf8"),
  ),
);

// With no PostHog key, analytics must stay fully off: no script in the page
// and no request to PostHog.
test("without a PostHog key nothing loads", async ({ page }) => {
  test.skip(
    Boolean(process.env.E2E_BASE_URL) || keySet,
    "this build has a PostHog key",
  );
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(await page.content()).not.toMatch(/posthog/i);
  expect(requests.filter((url) => /posthog/i.test(url))).toEqual([]);
});

const gtmSet = Boolean(
  process.env.PUBLIC_GTM_ID ??
  /^PUBLIC_GTM_ID=[ \t]*["']?[^\s#"']/m.test(
    readFileSync(".env.production", "utf8"),
  ),
);

// Tag Manager sets cookies, so tests build with it off (CI blanks the ID).
test("without a Tag Manager ID nothing loads from Google", async ({ page }) => {
  test.skip(
    Boolean(process.env.E2E_BASE_URL) || gtmSet,
    "this build has a Tag Manager ID",
  );
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(await page.content()).not.toMatch(/googletagmanager/);
  expect(requests.filter((url) => /googletagmanager/.test(url))).toEqual([]);
});
