# Agent instructions

This repo is a client **brochure site** made from the Talasi Astro static template. Brochure sites
have content edited in Sanity and no logins. Read this file before changing anything. If the client
needs logins, user submissions or admin review, the site belongs on the Next.js app template
instead.

## This site's exceptions to the template

- **No Talasi credit** in the footer, by the owner's choice (2026-10-11).
- **Newsletter:** `worker/newsletter.ts` adds sign-ups to a Resend segment (`/api/newsletter`).
- **Seed content:** until the Sanity project ID is in `.env.production`, build with
  `SANITY_SEED_FILE=sanity/seed/content.ndjson`. `scripts/build-seed.mjs` makes it from the old
  Google Sheet export.

## Before you start

- Read `README.md`, `SETUP.md`, `DESIGN.md` and `design/STATUS.md`.
- Check the installed version's docs for Astro, Sanity and Wrangler before writing code. Astro 7
  has a stricter compiler (unclosed or invalid HTML fails the build) and uses Vite 8.

## Build order

Build in this order. Don't start a step until the one before it is done and recorded.

1. **Requirements and content map.** Fill in the brief at the top of `DESIGN.md`. Classify every
   piece of content as **code** or **CMS**. Anything the client may ever change goes in the CMS,
   never in code.
2. **Design spec.** Write the brand sheet and design direction in `DESIGN.md`. Then run the design
   rounds in Claude Design, or an equivalent tool that exports HTML or tokens. Cap it at three
   rounds:
   1. Two or three homepage directions that look clearly different from each other.
   2. The key screens, including mobile.
   3. Empty and error states.

   Record **why** the client chose the direction.

3. **Design system.** Turn the approved direction into tokens in `src/styles/global.css`, keeping
   the role names. Add component guidelines to `DESIGN.md`. Mirror the sources into `design/`.
4. **Sign-off.** The client approves `DESIGN.md`. Record the date and the approver. From then on the
   design system is the source of truth.
5. **Template defaults.** Replace these before building on them:
   - `public/favicon.ico`, `icon.svg` and `apple-touch-icon.png`, drawn from the client's logo on
     an opaque tile (iOS fills transparency with black). `npm test` fails while any of them is
     still the placeholder (`tests/unit/icons.test.ts`), from the `provision.sh rename` step on; that
     failure is expected until this step.
   - `public/og.png`, the link-preview fallback: `node scripts/og-image.mjs "Name" [art.svg]`. The
     name alone, optionally over a brand illustration from `design/`; never CMS copy. The same
     icon test fails while it is still the placeholder.
   - the Studio title in `sanity.config.ts`
   - the site settings document in Sanity
6. **Foundations, then pages.** Build the shared header, footer and primitives first. Then build one
   page alone, then the rest, one PR per page with an independent review each.

**Don't style pages or build layout while `DESIGN.md` says `Status: draft`.**

## Rules

- **Static only.** Pages are prerendered from Sanity at build time and served as Workers static
  assets, which use no Worker CPU. That's what keeps the site on Cloudflare's free plan.
  - Don't add an SSR adapter, `output: "server"` or per-request rendering.
  - The Worker in `worker/` handles `/api/*` only. Keep each request well under the free plan's
    10 ms of CPU: no heavy dependencies, plain `fetch`.
- **No content in code.** Copy, photos and contact details live in Sanity. UI strings live in
  `src/i18n/*.json`.
- **Singletons have fixed `_id`s and arrays have keyed items.** Write document shapes into
  `OPERATIONS.md`.
- **Images:** size every CMS image through Sanity's CDN (`urlFor(image).width(n)` or
  `<SanityImage>`). There's no image service at request time.
- **Content updates need a rebuild.** A Sanity publish calls the Workers Builds deploy hook. Tell
  the client edits take a few minutes to appear.
- **Analytics** is PostHog, cookieless (no cookies or storage, so no consent banner unless something else on the site
  uses cookies), loaded from
  `src/components/Analytics.astro`. It's off until `PUBLIC_POSTHOG_KEY` is set; keep it that way
  in dev and tests.
- **Forms** must work without JavaScript, as the contact form does.
- **Secrets** are Worker secrets only. Public build values go in `.env.production`. Never put
  credentials, client data or env values in commits, PRs or chat.
- **SEO.** Base.astro gives every page a title, description, canonical, hreflang, Open Graph and
  Twitter tags, and an absolute `og:image`. That image comes from the page, then the CMS default,
  then `public/og.png`. The homepage title is "Site | Tagline", from Site settings. Indexable
  pages need a description of 30 characters or more. JSON-LD goes through `jsonLdScript()` and
  references only URLs that resolve. The homepage carries `WebSite` and `Organization` data. Result
  pages and the 404 are `noindex` and stay out of the sitemap. `e2e/pages.spec.ts` checks the tags,
  images and JSON-LD, so add each new indexable route to `INDEXABLE` there. Descriptions come from
  the CMS, so check them before launch.
- **The Talasi credit** stays in the footer of client sites, except where the owner opted out
  (this one did).

## Before you report a change as done

Run all of these and fix what fails. Don't hand verification back to a person.

```bash
npm run lint
npm run typecheck
npm test
npm run build && npm run e2e
```

Every PR states what was verified and what wasn't. Work on a branch and open a PR. Never push to
`main`, deploy, or change external accounts without explicit approval.
