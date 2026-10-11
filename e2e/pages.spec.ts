import { expect, test } from "@playwright/test";

const PAGES = [
  { path: "/", title: /^Arch Lunar Art Archive$/ },
  { path: "/artist", title: /^Artists \| / },
  {
    path: "/artist/anarchy-dance-theatre",
    title: /^Anarchy Dance Theatre \| /,
  },
  { path: "/artist/aaron-naves", title: /^Aaron Naves \| / },
  { path: "/contact", title: /^Contact \| / },
];

for (const { path, title } of PAGES) {
  test(`${path} renders`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(title);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`${path === "/" ? "/" : path}$`),
    );
    await expect(page.locator('meta[property="og:site_name"]')).toHaveCount(1);
  });
}

// Every indexable page, so each one is checked for a full link preview.
const INDEXABLE = [
  "/",
  "/artist",
  "/artist/anarchy-dance-theatre",
  "/artist/aaron-naves",
  "/contact",
];

for (const path of INDEXABLE) {
  test(`${path} has an absolute link-preview image`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    for (const selector of [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
    ]) {
      expect(await page.locator(selector).getAttribute("content")).toMatch(
        /^https?:\/\//,
      );
    }
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveCount(1);
    expect(
      (await page.locator('meta[name="description"]').getAttribute("content"))
        ?.length,
    ).toBeGreaterThanOrEqual(30);
  });
}

test("the fallback link-preview image is served", async ({ request }) => {
  const response = await request.get("/og.png");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("image/png");
});

test("the homepage describes the site and the organisation", async ({
  page,
}) => {
  await page.goto("/");
  const types = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).map((s) => JSON.parse(s)["@type"]);
  expect(types).toEqual(["Organization", "WebSite"]);
});

test("pages are static assets with no JavaScript framework", async ({
  request,
}) => {
  const response = await request.get("/contact");
  expect(response.headers()["content-type"]).toContain("text/html");
  expect(await response.text()).not.toContain("astro-island");
});

test("unknown pages get the 404 page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
});

test("robots.txt and the sitemap are served", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("sitemap-index.xml");
  const sitemap = await request.get("/sitemap-0.xml");
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  expect(xml).toContain("/contact</loc>");
  expect(xml).not.toContain("/404");
  expect(xml).not.toContain("/contact/sent");
  expect(xml).toContain("/artist/aaron-naves</loc>");
  expect(xml).not.toContain("/newsletter/");
});

test("unknown API routes 404 from the Worker", async ({ request }) => {
  const response = await request.get("/api/nope");
  expect(response.status()).toBe(404);
  expect(await response.json()).toEqual({ error: "Not found" });
});

test("every artist from the old site keeps its URL", async ({ page }) => {
  await page.goto("/artist");
  const links = page.locator('main a[href^="/artist/"]');
  await expect(links).toHaveCount(134);
  await expect(links.first()).toHaveText("Aaron Naves");
});

test("an artist's website and statement are shown, with no broken images", async ({
  page,
}) => {
  await page.goto("/artist/anarchy-dance-theatre");
  await expect(
    page.getByRole("link", { name: "www.anarchydancetheatre.com" }),
  ).toHaveAttribute("href", "https://www.anarchydancetheatre.com");
  await expect(page.getByText(/groundbreaking digital dance/)).toBeVisible();
  await expect(page.locator("main img")).toHaveCount(0);
});
