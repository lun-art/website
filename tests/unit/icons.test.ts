import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// The template ships placeholder icons (a white square on grey) and a
// placeholder link-preview image ("[SITE NAME]"). A client site must replace
// all four before launch (AGENTS.md, build step 5); this fails
// until it does.
const PLACEHOLDERS: Record<string, string> = {
  "favicon.ico":
    "eafdf207d08dfdcaced448974a27b1c08b9420a2a061d485997cc24f1e940c76",
  "icon.svg":
    "c7248ed264e403626ca6fcda7be4547e2be0ed0a337533babd01293c0df26274",
  "apple-touch-icon.png":
    "3c20e0540e71d2edc7a25228cfd0613b05603ed047e4159298d1cba15ddb6643",
  "og.png": "16fd278af29a0bf4c5cb9a54e378151c84c741696d3c79f6bd0bb6de1a01cb0a",
};

const root = new URL("../../", import.meta.url);
const isTemplate =
  JSON.parse(readFileSync(new URL("package.json", root), "utf8")).name ===
  "talasi-astro-template";

describe.skipIf(isTemplate)("site icons", () => {
  for (const [file, placeholder] of Object.entries(PLACEHOLDERS)) {
    it(`replaces the template's ${file}`, () => {
      const hash = createHash("sha256")
        .update(readFileSync(new URL(`public/${file}`, root)))
        .digest("hex");
      expect(hash, `public/${file} is still the template placeholder`).not.toBe(
        placeholder,
      );
    });
  }
});
