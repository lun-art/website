# Talasi Astro static template

The starting point for Talasi client **brochure sites**: sites whose content is edited in Sanity,
with no logins. It runs on Cloudflare's free plan. App sites with logins start from
`azhang/talasi-nextjs-template`.

- **Agents:** read [AGENTS.md](./AGENTS.md) first. Design comes before layout.
- **Setting up a new client:** follow [SETUP.md](./SETUP.md).
- **Design work:** [DESIGN.md](./DESIGN.md) and [design/](./design).
- **Client-facing guide:** [OPERATIONS.md](./OPERATIONS.md).

## Stack

|                 |                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| Framework       | Astro 7, `output: "static"`, optional i18n through a `[...lang]` prefix (one locale by default)        |
| CMS             | Sanity, read at build time. The Studio is hosted at `<slug>.sanity.studio` (free)                      |
| Content updates | Sanity publish webhook, then the Workers Builds deploy hook, then a production rebuild (a few minutes) |
| Images          | Sanity image CDN with `srcset`. Nothing is transformed at request time                                 |
| Hosting         | Cloudflare Workers static assets on the free plan. The Worker runs only for `/api/*`                   |
| Contact form    | Worker endpoint that calls Resend's REST API. Works without JavaScript. Honeypot                       |
| Tests           | Vitest unit tests; Playwright smoke tests on `wrangler dev` with a mock Resend                         |
| CI              | Lint, types, unit, build and e2e on every PR                                                           |
| Updates         | Renovate weekly: grouped minor/patch automerge on green CI, majors as separate PRs                     |

## What's in it

```
src/pages/[...lang]/        home (CMS "home" page), CMS pages, contact (+ sent/error)
src/pages/404.astro         served for any missing path
src/layouts/Base.astro      title template, canonical, hreflang, Open Graph, JSON-LD
worker/                     the contact endpoint (the only code that runs on Cloudflare)
sanity/schemas/             siteSettings (singleton), page, imageWithAlt (same as the Next template)
scripts/provision.sh        Worker, Workers Builds, deploy hook, Sanity webhook, Studio
```

## Versions

Every dependency started at its latest release on 2026-10-02, with one exception. **TypeScript is
6.0, not 7**, because `typescript-eslint` and `@astrojs/check` require TypeScript below 6.1.
Renovate holds it. Install-script approvals are in `allowScripts` in `package.json`, listed by
package name only.
