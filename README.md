# lun.art

The website of the Arch Lunar Art Archive: the artists whose work is preserved on the moon, a
page for each, and the newsletter. Built from the Talasi Astro static template, so content is
edited in Sanity and pages are static files on Cloudflare's free plan.

- **Agents:** read [AGENTS.md](./AGENTS.md) first, including this site's exceptions.
- **Design:** the approved spec is [DESIGN.md](./DESIGN.md); status is in [design/](./design).
- **Setting up Sanity, Cloudflare and email, and moving off the old site:** [SETUP.md](./SETUP.md).
- **Editing content day to day:** [OPERATIONS.md](./OPERATIONS.md).

Until a Sanity project ID is in `.env.production`, build with the seed content:

```bash
SANITY_SEED_FILE=sanity/seed/content.ndjson npm run build
```

## Stack

|                 |                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| Framework       | Astro 7, `output: "static"`, optional i18n through a `[...lang]` prefix (one locale by default)        |
| CMS             | Sanity, read at build time. The Studio is hosted at `<slug>.sanity.studio` (free)                      |
| Content updates | Sanity publish webhook, then the Workers Builds deploy hook, then a production rebuild (a few minutes) |
| Images          | Sanity image CDN with `srcset`. Nothing is transformed at request time                                 |
| Hosting         | Cloudflare Workers static assets on the free plan. The Worker runs only for `/api/*`                   |
| Forms           | Contact and newsletter: Worker endpoints that call Resend's REST API. Work without JavaScript          |
| Analytics       | PostHog (cookieless) and Google Tag Manager, each off until its ID is set                              |
| Tests           | Vitest unit tests; Playwright smoke tests on `wrangler dev` with a mock Resend                         |
| CI              | Lint, types, unit, build and e2e on every PR                                                           |
| Updates         | Renovate weekly: grouped minor/patch automerge on green CI, majors as separate PRs                     |

## What's in it

```
src/pages/[...lang]/        home, artist/ (list + one page per artist), CMS pages, contact, newsletter/sent|error
src/pages/404.astro         served for any missing path
src/layouts/Base.astro      title template, canonical, hreflang, Open Graph, JSON-LD
worker/                     the contact and newsletter endpoints (the only code that runs on Cloudflare)
sanity/schemas/             siteSettings and home (singletons), artist, page, imageWithAlt
sanity/seed/                the old Google Sheet export and the NDJSON seed built from it
scripts/provision.sh        Worker, Workers Builds, deploy hook, Sanity webhook, Studio
```

## Versions

Every dependency was at its latest release on 2026-10-11, with one exception. **TypeScript is
6.0, not 7**, because `typescript-eslint` and `@astrojs/check` require TypeScript below 6.1.
Renovate holds it. Install-script approvals are in `allowScripts` in `package.json`, listed by
package name only.
