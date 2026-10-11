interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_SANITY_PROJECT_ID?: string;
  readonly PUBLIC_SANITY_DATASET?: string;
  readonly PUBLIC_POSTHOG_KEY?: string;
  readonly PUBLIC_POSTHOG_HOST?: string;
  /** Google Tag Manager container, e.g. GTM-XXXXXXX. Off while empty. */
  readonly PUBLIC_GTM_ID?: string;
  /** Local and CI only: NDJSON export to build from when no Sanity project is set. */
  readonly SANITY_SEED_FILE?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
