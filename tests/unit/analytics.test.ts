import { describe, expect, it } from "vitest";
import { posthogOptions, posthogSettings } from "@/lib/analytics";

describe("posthog settings", () => {
  it("is off unless both the key and the host are set", () => {
    expect(posthogSettings({})).toBeNull();
    expect(posthogSettings({ PUBLIC_POSTHOG_KEY: "phc_x" })).toBeNull();
    expect(
      posthogSettings({ PUBLIC_POSTHOG_HOST: "https://eu.i.posthog.com" }),
    ).toBeNull();
    expect(
      posthogSettings({
        PUBLIC_POSTHOG_KEY: "  ",
        PUBLIC_POSTHOG_HOST: "https://eu.i.posthog.com",
      }),
    ).toBeNull();
    expect(
      posthogSettings({
        PUBLIC_POSTHOG_KEY: "phc_x",
        PUBLIC_POSTHOG_HOST: "https://eu.i.posthog.com",
      }),
    ).toEqual({ key: "phc_x", host: "https://eu.i.posthog.com" });
  });

  it("never stores anything in the browser", () => {
    expect(posthogOptions("https://eu.i.posthog.com")).toMatchObject({
      api_host: "https://eu.i.posthog.com",
      cookieless_mode: "always",
      person_profiles: "never",
    });
  });
});
