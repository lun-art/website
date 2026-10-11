import { describe, expect, it } from "vitest";
import {
  langParam,
  localeFromParam,
  localePath,
  localeStaticPaths,
  t,
} from "@/i18n";

describe("i18n", () => {
  it("keeps the default locale unprefixed", () => {
    expect(langParam("en")).toBeUndefined();
    expect(localePath("en", "/")).toBe("/");
    expect(localePath("en", "/contact")).toBe("/contact");
    expect(localeStaticPaths()).toEqual([
      { params: { lang: undefined }, props: { locale: "en" } },
    ]);
  });

  it("falls back to the default locale for unknown params", () => {
    expect(localeFromParam("xx")).toBe("en");
    expect(localeFromParam(undefined)).toBe("en");
  });

  it("fills placeholders", () => {
    expect(
      t("en", "footer.rights", { year: 2026, siteName: "Client Co" }),
    ).toBe("© 2026 Client Co");
  });
});
