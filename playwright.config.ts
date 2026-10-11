import { defineConfig, devices } from "@playwright/test";

// Smoke tests against the built site served exactly as in production:
// `wrangler dev` with the static assets and the contact Worker. Resend is
// replaced by a local mock. Run `npm run build` first. Set E2E_BASE_URL to
// test a deployed preview instead (the email assertions are then skipped).
const port = 8788;
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${port}`;
export const MOCK_RESEND = "http://127.0.0.1:4010";

const vars = {
  RESEND_API_KEY: "re_e2e",
  RESEND_FROM: "Site <hello@site.test>",
  CONTACT_NOTIFY_EMAIL: "owner@site.test",
  RESEND_API_URL: `${MOCK_RESEND}/emails`,
};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : [
        {
          command: "node e2e/mock-resend.mjs",
          url: MOCK_RESEND,
          reuseExistingServer: !process.env.CI,
        },
        {
          command: `npx wrangler dev --port ${port} ${Object.entries(vars)
            .map(([k, v]) => `--var ${JSON.stringify(`${k}:${v}`)}`)
            .join(" ")}`,
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
        },
      ],
});
