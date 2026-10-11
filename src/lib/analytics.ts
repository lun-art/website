import type { PostHogConfig } from "posthog-js";

/**
 * PostHog settings from the public build env. Analytics is on only when both
 * the project key and the host are set; otherwise nothing is rendered or
 * loaded.
 */
export function posthogSettings(env: {
  PUBLIC_POSTHOG_KEY?: string;
  PUBLIC_POSTHOG_HOST?: string;
}): { key: string; host: string } | null {
  const key = env.PUBLIC_POSTHOG_KEY?.trim();
  const host = env.PUBLIC_POSTHOG_HOST?.trim();
  return key && host ? { key, host } : null;
}

/**
 * Cookieless: PostHog never stores anything in the visitor's browser, so the
 * site needs no consent banner. Visitors are counted by a privacy-preserving
 * hash calculated on PostHog's servers. The PostHog project must have
 * "Cookieless server hash mode" turned on (Project Settings > Web analytics),
 * or PostHog ignores every cookieless event. person_profiles "never" turns identify() into a no-op: a
 * persistent ID is personal data under GDPR and would undo the point.
 */
export function posthogOptions(host: string): Partial<PostHogConfig> {
  return {
    api_host: host,
    defaults: "2026-08-29",
    cookieless_mode: "always",
    person_profiles: "never",
    // Pinned off so a dashboard setting can't start collecting more than
    // cookieless pageviews and clicks.
    disable_session_recording: true,
    disable_surveys: true,
    capture_dead_clicks: false,
  };
}
