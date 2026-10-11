import { describe, expect, it } from "vitest";
import {
  jsonLdScript,
  organizationJsonLd,
  PLACEHOLDER_SITE_NAME,
  siteNameOf,
  socialImageFor,
  titleFor,
  websiteJsonLd,
} from "@/lib/site";

describe("site helpers", () => {
  it("builds the title template", () => {
    expect(titleFor("Contact", "Client Co")).toBe("Contact | Client Co");
    expect(titleFor(undefined, "Client Co")).toBe("Client Co");
  });

  it("adds the tagline to the homepage title only", () => {
    expect(titleFor(undefined, "Client Co", "Tours")).toBe("Client Co | Tours");
    expect(titleFor("Contact", "Client Co", "Tours")).toBe(
      "Contact | Client Co",
    );
  });

  it("falls back to the committed social image as an absolute URL", () => {
    expect(socialImageFor("https://client.example", undefined, {})).toEqual({
      url: "https://client.example/og.png",
    });
  });

  it("describes the website for the homepage", () => {
    expect(websiteJsonLd("Client Co", "https://client.example/")).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Client Co",
      url: "https://client.example/",
    });
  });

  it("escapes markup in inline JSON-LD", () => {
    expect(jsonLdScript({ a: "</script>" })).toBe(
      String.raw`{"a":"\u003c/script>"}`,
    );
  });

  it("uses a visible placeholder until the CMS has a name", () => {
    expect(siteNameOf(null)).toBe(PLACEHOLDER_SITE_NAME);
    expect(siteNameOf({ siteName: "Client Co" })).toBe("Client Co");
  });

  it("omits structured-data fields with no value", () => {
    const jsonLd = organizationJsonLd(null, "https://client.example");
    expect(jsonLd).not.toHaveProperty("sameAs");
    expect(jsonLd).not.toHaveProperty("description");
    expect(jsonLd.url).toBe("https://client.example");
  });

  it("falls back to the committed icon for the logo", () => {
    expect(organizationJsonLd(null, "https://client.example").logo).toBe(
      "https://client.example/apple-touch-icon.png",
    );
  });
});
