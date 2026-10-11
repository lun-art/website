# Setup

How to turn this template into a running client brochure site. Whether a person or an agent is
following it, work through it top to bottom. **Before any build work, read `AGENTS.md`.**

## 0. Pick the right template

| The client needs                                      | Template                        | Hosting cost                                   |
| ----------------------------------------------------- | ------------------------------- | ---------------------------------------------- |
| A brochure site with CMS-edited content and no logins | **This one** (Astro, static)    | Cloudflare free plan                           |
| Logins, user submissions, admin review                | `azhang/talasi-nextjs-template` | Workers Paid, $5 a month for the whole account |

The free plan fits because pages are static assets. Requests for static assets are free and don't
invoke the Worker, so they use no CPU and don't count against the Worker request quota. The Worker
runs only for `/api/contact`, a 3.5 KiB bundle that calls Resend with one `fetch`.

## 1. Prerequisites

- Node 24, pinned in `.node-version` and `engines.node`. Use npm 11 locally.
- Accounts:
  - Cloudflare (the free plan is enough)
  - a Sanity project (free plan)
  - Resend, at launch
  - GitHub
- GitHub apps with access to the new repo. **Both are per-repo today: add each new client repo by
  hand.** A Talasi GitHub organization that grants "All repositories" would remove this step.
  - **Cloudflare Workers and Pages**, so Workers Builds can see the repo.
  - **Renovate** (Mend), for the weekly dependency PRs.

## 2. Create the repo

```bash
gh repo create azhang/<client> --private --template azhang/talasi-astro-template --clone
cd <client>
npm ci
```

## 3. Provision

```bash
cp scripts/provision.env.example provision.env   # fill it in; gitignored
./scripts/provision.sh --dry-run
./scripts/provision.sh                           # asks before each external change
```

| Step     | Does                                                                                                       | Creates or changes          |
| -------- | ---------------------------------------------------------------------------------------------------------- | --------------------------- |
| `rename` | Replaces `talasi-astro-template` with the client slug and sets the Studio title                            | Local files                 |
| `env`    | Writes the public build values to `.env.production`                                                        | Local file                  |
| `worker` | Builds and deploys once from this machine, so the Worker exists for Workers Builds to attach to            | Worker                      |
| `github` | Turns on delete-branch-on-merge, turns platform auto-merge off, and sets the CI variables for the CMS test | Repo settings               |
| `builds` | Connects Workers Builds: `main` deploys, other branches upload a preview version                           | Builds triggers             |
| `hook`   | Creates a deploy hook for `main` and a Sanity webhook that calls it on publish (drafts excluded)           | Deploy hook, Sanity webhook |
| `sanity` | Adds CORS origins for the hosted Studio and deploys it to `<slug>.sanity.studio`                           | CORS, Studio                |
| `email`  | **Launch only**, not run by default. Sets the Resend secrets for the contact form                          | Worker secrets              |

Then commit `wrangler.jsonc`, `.env.production`, `package.json`, `package-lock.json`,
`sanity.cli.ts` and `sanity.config.ts`, and push to `main`.

**The deploy hook URL is a credential.** Anyone who has it can start a build. It's stored only in
the Sanity webhook and in `.provision-state`, which is gitignored.

### Workers Builds settings

The `builds` step creates these. To set them by hand: Worker > Settings > Builds.

| Setting                              | Value                                        |
| ------------------------------------ | -------------------------------------------- |
| Production branch                    | `main`                                       |
| Build command                        | `npm run build`                              |
| Deploy command                       | `npx wrangler deploy`                        |
| Non-production branch deploy command | `npx wrangler versions upload`               |
| Build variables                      | none: public values are in `.env.production` |

## 4. Environment variables

| Variable                                | Kind   | Local (`.env`)          | Build (`.env.production`, committed) | Worker secret | CI                          | Source                               |
| --------------------------------------- | ------ | ----------------------- | ------------------------------------ | ------------- | --------------------------- | ------------------------------------ |
| `PUBLIC_SITE_URL`                       | public | `http://localhost:4321` | production URL                       | –             | –                           | the domain                           |
| `PUBLIC_SANITY_PROJECT_ID`              | public | yes                     | yes                                  | –             | `E2E_SANITY_PROJECT_ID` var | Sanity                               |
| `PUBLIC_SANITY_DATASET`                 | public | `development`           | `production`                         | –             | `E2E_SANITY_DATASET` var    | Sanity                               |
| `PUBLIC_POSTHOG_KEY`                    | public | empty (off)             | at launch                            | –             | –                           | PostHog project token                |
| `PUBLIC_POSTHOG_HOST`                   | public | –                       | `https://eu.i.posthog.com`           | –             | –                           | PostHog (EU cloud)                   |
| `SANITY_STUDIO_PROJECT_ID` / `_DATASET` | public | for `npm run studio`    | –                                    | –             | –                           | same values, for the Studio          |
| `RESEND_API_KEY`                        | secret | –                       | –                                    | at launch     | –                           | Resend                               |
| `RESEND_FROM`                           | secret | –                       | –                                    | at launch     | –                           | e.g. `Client <hello@client.example>` |
| `CONTACT_NOTIFY_EMAIL`                  | secret | –                       | –                                    | at launch     | –                           | the client                           |
| `RESEND_SEGMENT_ID`                     | secret | –                       | –                                    | at launch     | –                           | Resend > Audience > Segments         |
| `PUBLIC_GTM_ID`                         | public | empty (off)             | `GTM-PK2ML5FB`                       | –             | blanked                     | Google Tag Manager                   |
| `SANITY_SEED_FILE`                      | local  | until Sanity is set up  | –                                    | –             | set in the build step       | `sanity/seed/content.ndjson`         |
| `E2E_SANITY_WRITE_TOKEN`                | secret | –                       | –                                    | –             | Actions secret              | Sanity Editor token                  |

- Until the email secrets are set, the contact form answers "couldn't be sent". Previews share
  production's secrets, so set them only at launch.
- Analytics is off while `PUBLIC_POSTHOG_KEY` is empty: no script is rendered and nothing loads.
- **Never put variables in the Cloudflare dashboard.** `wrangler deploy` replaces them with the
  repo's configuration.

## 5. Local development

```bash
cp .env.example .env    # add your Sanity project ID
npm run dev             # http://localhost:4321
npm run studio          # Studio on http://localhost:3333 (set SANITY_STUDIO_* first)
npm run preview         # build, then wrangler dev: static assets + the contact Worker
```

## 6. Tests

| Command                                          | What                                                                                                                  |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `npm test`                                       | Vitest: contact Worker (validation, honeypot, Resend call, redirects), i18n, site helpers, placeholder icons replaced |
| `npm run build && npm run e2e`                   | Playwright against `wrangler dev`, with Resend replaced by a local mock                                               |
| `E2E_BASE_URL=https://<preview-url> npm run e2e` | The page tests against a deployed preview                                                                             |

The e2e tests cover:

- every page, including the title template, canonical link and Talasi credit
- 404s, robots.txt and the sitemap
- unknown API routes
- the contact form with and without JavaScript
- a Sanity publish appearing in the next build (needs `E2E_SANITY_*`)

CI runs lint, types, unit tests, the build and e2e on every PR. It installs dependencies the way
Workers Builds does (`npm@10.9.2 ci --legacy-peer-deps`).

## 7. Dependency updates

Renovate runs weekly, early on Monday (Vienna time):

- Minor and patch updates arrive as one grouped PR, which Renovate merges only once CI is green.
- Majors arrive as separate PRs for review.
- New releases wait 3 days before Renovate proposes them.
- TypeScript is held below 6.1 until `typescript-eslint` and `@astrojs/check` support 7.

## 8. Internationalisation

One locale, `en`, with no URL prefix. Pages live under `src/pages/[...lang]/`, so adding a locale
needs no route changes. To add one:

1. Add it to `locales` in `src/i18n/index.ts` and in `astro.config.mjs` (`i18n.locales`).
2. Add `src/i18n/<code>.json` with every key from `en.json`.
3. Add its codes to `HREFLANG` and `OG_LOCALE` in `src/i18n/index.ts`.
4. Translate the CMS content (localized fields in the schemas), and name a person to review it.

## 9. Moving off the old Next.js site

The old site was Next.js on Cloudflare Pages, with artists in a Google Sheet and the newsletter in
Mailchimp. In order:

1. **Sanity.** Create the project, then load the seed (site settings, home page and the 134
   artists from the sheet):

   ```bash
   npx sanity dataset import sanity/seed/content.ndjson production
   ```

   From then on Sanity is the source of truth; the sheet and the seed are history.

2. **Provision** as in step 3 (`rename` is already done: the slug is `lun-art`).
3. **Newsletter.** In Resend, create a segment for the newsletter. Export the audience from
   Mailchimp as CSV and import it into that segment (Resend > Audience > Import, or
   `POST /contacts/imports`). Keep the export somewhere private: it's personal data.
4. **Preview** the Workers deploy on its `workers.dev` URL and check every page against lun.art.
5. **Cut over.** Remove `lun.art` from the Cloudflare Pages project, add it to the Worker as a
   custom domain, then delete the Pages project once the Worker serves the domain.

## 10. Launch

1. Move DNS to Cloudflare. Record the registrar's email forwarding first and recreate it in
   Cloudflare Email Routing.
2. Add the custom domain to the Worker.
3. Set `SITE_URL` to the real domain and re-run `./scripts/provision.sh env`. Commit and push.
4. Set the email secrets with `./scripts/provision.sh email`.
5. Turn on analytics. In PostHog (EU cloud), create a project for the client, then turn on
   **Cookieless server hash mode** under Project Settings > Web analytics. Without it PostHog
   ignores every event the site sends. Put the project token in `PUBLIC_POSTHOG_KEY` in `.env.production`, then
   commit and push.
6. Check each of these yourself:
   - the contact form delivers, with JavaScript and without it
   - a Studio publish rebuilds the site within a few minutes
   - a link pasted into WhatsApp and Telegram shows the right preview
   - the sitemap is present
   - Search Console is connected under the client's own account
   - a visit shows up in PostHog's live events
