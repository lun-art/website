// Renders public/og.png, the 1200×630 link-preview image used when the CMS
// has no social image. Like the favicon, it's a brand asset: the name alone,
// so it holds no copy that could drift from the CMS. Run it again when the
// name or the brand changes:
//
//   node scripts/og-image.mjs "Site name" [art.svg]
//
// Without art, the name sits centred in a frame. With art (a brand
// illustration from design/, drawn edge to edge), the name sits in a title
// box over it. OG_IMAGE_OUT overrides the output path.
//
// Colours and the display font come from src/styles/global.css, and self-hosted
// faces from src/styles/fonts.css when the site has one, so the image follows
// the design system and needs no network.
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const [name, art] = process.argv.slice(2);
if (!name) {
  console.error('Usage: node scripts/og-image.mjs "Site name" [art.svg]');
  process.exit(1);
}

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const css = read("src/styles/global.css");
const token = (n, fallback) =>
  css.match(new RegExp(`--${n}:\\s*([^;]+);`))?.[1].trim() ?? fallback;
const stack = (n, fallback) => {
  const value = token(n, fallback);
  // A stack that points at another token, e.g. var(--font-sans).
  const ref = value.match(/^var\(--([\w-]+)\)$/)?.[1];
  return ref ? token(ref, fallback) : value;
};
const ink = token("color-foreground", "#111");
const paper = token("color-background", "#fff");
const display = stack("font-display", "sans-serif");

// Self-hosted faces: point their /fonts/ URLs at the files on disk.
const fontsDir = pathToFileURL(
  fileURLToPath(new URL("public/fonts/", root)),
).href;
const faces = existsSync(new URL("src/styles/fonts.css", root))
  ? read("src/styles/fonts.css").replaceAll('url("/fonts/', `url("${fontsDir}`)
  : "";

const escape = (s) =>
  s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

const artUrl = art && pathToFileURL(resolve(art)).href;

const base = `
${faces}
html, body { margin: 0; width: 1200px; height: 630px; background: ${paper}; color: ${ink}; }
.name { font: 700 160px/0.9 ${display}; letter-spacing: -0.01em; text-transform: uppercase;
  max-width: 100%; text-wrap: balance; }`;

const html = artUrl
  ? `<!doctype html><html><head><meta charset="utf-8"><style>${base}
.art { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.frame { position: absolute; inset: 32px; border: 1px solid ${ink}; }
.box { position: absolute; left: 72px; bottom: 72px; max-width: 640px; padding: 36px 44px 32px;
  background: ${paper}; border: 1px solid ${ink}; }
.name { font-size: 132px; }
</style></head><body><img class="art" src="${artUrl}" alt="">
<div class="frame"></div>
<div class="box"><div class="name">${escape(name)}</div></div></body></html>`
  : `<!doctype html><html><head><meta charset="utf-8"><style>${base}
.frame { position: absolute; inset: 48px; border: 2px solid ${ink}; display: flex;
  align-items: center; justify-content: center; padding: 0 88px; }
.name { text-align: center; }
</style></head><body><div class="frame">
<div class="name">${escape(name)}</div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
// A file page, not setContent: about:blank can't load file:// fonts.
const dir = mkdtempSync(join(tmpdir(), "og-image-"));
const htmlPath = join(dir, "og.html");
writeFileSync(htmlPath, html);
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
await page.evaluate(async () => {
  await document.fonts.ready;
  // A long name wraps; shrink it until it fits.
  const el = document.querySelector(".name");
  const fits = () =>
    el.scrollWidth <= el.clientWidth &&
    el.getBoundingClientRect().top >= 72 &&
    el.getBoundingClientRect().bottom <= 630 - 72;
  let size = parseFloat(getComputedStyle(el).fontSize);
  while (size > 48 && !fits()) {
    size -= 4;
    el.style.fontSize = `${size}px`;
  }
});
const out =
  process.env.OG_IMAGE_OUT ?? fileURLToPath(new URL("public/og.png", root));
await page.screenshot({ path: out });
await browser.close();
rmSync(dir, { recursive: true });
console.log(`Wrote ${out}`);
