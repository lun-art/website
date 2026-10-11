import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createClient } from "@sanity/client";
import { expect, test } from "@playwright/test";

// A Sanity publish shows up in the next build. In production the Sanity
// webhook calls the Workers Builds deploy hook; here the test publishes to a
// non-production dataset and runs the build itself. Needs
// E2E_SANITY_PROJECT_ID and E2E_SANITY_WRITE_TOKEN; skipped without them.
test("a Sanity publish appears in the next build", async () => {
  const { E2E_SANITY_PROJECT_ID: projectId, E2E_SANITY_WRITE_TOKEN: token } =
    process.env;
  test.skip(
    !projectId || !token,
    "needs E2E_SANITY_PROJECT_ID and E2E_SANITY_WRITE_TOKEN",
  );
  test.setTimeout(180_000);

  const dataset = process.env.E2E_SANITY_DATASET ?? "e2e";
  const sanity = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2026-09-30",
    useCdn: false,
  });
  const slug = `e2e-${Date.now()}`;
  const title = `E2E page ${slug}`;
  const doc = await sanity.create({
    _type: "page",
    title,
    slug: { _type: "slug", current: slug },
  });
  const outDir = mkdtempSync(join(tmpdir(), "astro-e2e-"));

  try {
    execFileSync("npx", ["astro", "build", "--outDir", outDir], {
      env: {
        ...process.env,
        PUBLIC_SANITY_PROJECT_ID: projectId,
        PUBLIC_SANITY_DATASET: dataset,
      },
      stdio: "pipe",
    });
    expect(readFileSync(join(outDir, `${slug}.html`), "utf8")).toContain(title);
  } finally {
    await sanity.delete(doc._id);
    rmSync(outDir, { recursive: true, force: true });
  }
});
