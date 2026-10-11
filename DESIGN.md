# Design spec: Arch Lunar Art Archive

Status: approved

This site was moved from Next.js to the Talasi Astro template in October 2026. The design is a
1:1 port of the live lun.art design, so there were no design rounds: the live site was the
approved direction.

## 1. Brief

- **Business:** the Arch Lunar Art Archive, an extension of the Arch Mission Foundation: a
  snapshot of contemporary art from 2022, preserved on the moon.
- **Audience:** artists in the archive, collectors, press, and people curious about art in
  space. They come to browse the artists and to sign up for news.
- **Languages:** `en` only.
- **Must-have features:** artist list, one page per artist at `/artist/<slug>` (URLs kept from
  the old site), newsletter sign-up, contact form.
- **Integrations:** Sanity (content), Resend (newsletter segment and contact email), PostHog
  (cookieless). The old site's Google Tag Manager was dropped, so no cookie banner is needed.
- **Owner contact and channel:** Allie.

## 2. Content map

| Content                            | Lives in | Document or table             | Who edits     | Notes                                            |
| ---------------------------------- | -------- | ----------------------------- | ------------- | ------------------------------------------------ |
| Site name, description, links      | CMS      | `siteSettings` (singleton)    | Owner / agent | `socialLinks` feed the header and footer         |
| Footer line                        | CMS      | `siteSettings.footerMotto`    | Owner / agent |                                                  |
| Home title, intro, about blocks    | CMS      | `home` (singleton)            | Owner / agent | four about blocks fill the two-by-two grid       |
| Artists                            | CMS      | `artist`                      | Owner / agent | imported from the old Google Sheet on 2026-10-11 |
| Artwork images                     | CMS      | `artist.works[]`              | Owner / agent | none yet: the sheet never had any                |
| Other pages                        | CMS      | `page`                        | Owner / agent | `/<slug>`; none yet                              |
| Hero photograph                    | Code     | `src/assets/moon-surface.jpg` | Developer     | NASA PIA12936; a design asset, not content       |
| Logo                               | Code     | `public/logo.svg`             | Developer     | the icons and `og.png` are drawn from it         |
| UI strings (form labels, messages) | Code     | `src/i18n/en.json`            | Developer     |                                                  |
| Newsletter sign-ups                | Resend   | the newsletter segment        | Site (form)   | not stored on the site                           |
| Contact messages                   | Email    | Resend, to the owner          | Site (form)   | not stored                                       |

## 3. Data fields

| Field                   | Meaning                              | Unit       | When unknown                                          |
| ----------------------- | ------------------------------------ | ---------- | ----------------------------------------------------- |
| `artist.workTitle`      | The title of the work in the archive | text       | not shown                                             |
| `artist.website`        | The artist's own site                | URL        | not shown                                             |
| `artist.statement`      | Artist statement, line breaks kept   | text       | not shown; the description names the artist instead   |
| `artist.seoDescription` | Search description                   | ≤160 chars | start of the statement, else a line naming the artist |

## 4. Brand sheet

- **Name and tagline:** Arch Lunar Art Archive. "The first ever global contemporary art archive
  on the moon."
- **Logo:** `public/logo.svg`, a white crescent. Legible from 32 px.
- **Colours they have:** near-black `#161414`, white, warm light grey `#E8E6E6`.
- **Type they have:** Space Mono (self-hosted from `@fontsource/space-mono`), the system serif
  for the display line, the system sans for the second title line and the footer, Helvetica
  Neue for the about-block titles.
- **Domain status:** lun.art, live.

## 5. Direction

A port of the live site: a dark, archival look with crop marks around title boxes, a binary
rule ("ABOUT" in binary) between sections, and links that gain `[ ]` brackets on hover.

## 6. Theme

- [x] Dark only (the original design)

## 7. Tokens

In `src/styles/global.css`.

| Role                    | Token                        | Value          | Notes                                    |
| ----------------------- | ---------------------------- | -------------- | ---------------------------------------- |
| Body text               | `--color-foreground`         | `#ffffff`      |                                          |
| Secondary text          | `--color-muted`              | `#e8e6e6`      | about-block text, binary rule, crosses   |
| Page background         | `--color-background`         | `#161414`      |                                          |
| Large panels            | `--color-panel`              | `#252323`      | the hero gradient's end colour           |
| Borders                 | `--color-border`             | `#e5e7eb`      | Tailwind 3's default, as on the old site |
| Filled controls         | `--color-primary`            | `#ffffff`      | buttons fill white on hover              |
| Text on filled controls | `--color-primary-foreground` | `#000000`      |                                          |
| Errors                  | `--color-danger`             | `#ff8a80`      | light, for the dark background           |
| Success                 | `--color-success`            | `#b9f6ca`      |                                          |
| Body font               | `--font-sans`                | system sans    |                                          |
| Display font            | `--font-display`             | system serif   | the first title line                     |
| Mono font               | `--font-mono`                | Space Mono     | the home page, the forms                 |
| Block titles            | `--font-block`               | Helvetica Neue |                                          |

Helper utilities: `border-corners` (crop marks), `cross` and `cross-vert` (footer marks),
`bracket-link` (hover brackets, also on keyboard focus).

## 8. Components

- **Header:** logo and links. The links are hidden below `md`, as on the original site; the
  footer carries them there.
- **Footer:** crosses, logo, links in bold uppercase, the footer line. No agency credit.
- **Newsletter form:** full name, email, "Inquire" button in a crop-mark frame. Labels are
  visually hidden but present for screen readers. Works without JavaScript.
- **Artist list:** three columns from `md`, one below. A thin border appears on hover.
- **About blocks:** two per row, numbered, with × and + corner marks.

## 9. Page inventory

| Page                    | Desktop  | Mobile   | Empty state                 | Error state    |
| ----------------------- | -------- | -------- | --------------------------- | -------------- |
| Home                    | live     | live     | "Nothing published yet"     |                |
| Artists (`/artist`)     | live     | live     | "No artists published yet." |                |
| Artist                  | live     | live     | name only                   |                |
| Contact                 | template | template |                             | sending failed |
| Newsletter sent / error | new      | new      |                             | the error page |
| 404                     | template | template |                             |                |

## 10. Sign-off

Approved by: Allie on 2026-10-11, via Claude Code chat, as a 1:1 port of the live lun.art
design.

After sign-off this document is the source of truth. Where code disagrees with it, the code
changes.
