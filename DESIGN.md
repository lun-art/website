# Design spec: [SITE NAME]

Status: draft
<!-- Change to "Status: approved" only when the client signs off (see Sign-off). AGENTS.md
forbids styling pages or building layout while this says draft. -->

Fill this in top to bottom. Use placeholders such as `[EMAIL]`, `[PHONE]` and `[ADDRESS]` for
anything that lives in the CMS, in mockups as well as here.

## 1. Brief

- **Business:** what they do, for whom, where.
- **Audience:** who visits and what they came to do.
- **Languages:** `en` only, unless the client really needs more. Each extra locale needs a named
  reviewer.
- **Must-have features:**
- **Integrations:**
- **Owner contact and channel:**

## 2. Content map

Every piece of content, and where it lives. Anything the client will ever change is CMS or DB.

| Content                      | Lives in | Document or table          | Who edits      | Notes                       |
| ---------------------------- | -------- | -------------------------- | -------------- | --------------------------- |
| Site name, description, logo | CMS      | `siteSettings` (singleton) | Client / agent |                             |
| Page copy                    | CMS      | `page`                     | Client / agent | slug `home` is the homepage |
| Contact messages             | Email    | Resend, to the owner       | Site (form)    | not stored                  |

## 3. Data fields

For each field: meaning, unit, and the rule for when the value is unknown.

| Field | Meaning | Unit | When unknown |
| ----- | ------- | ---- | ------------ |
|       |         |      |              |

## 4. Brand sheet

- **Name and tagline:**
- **Logo:** source file, and the minimum size it stays legible at.
- **Colours they have:**
- **Type they have:**
- **Sites they like, and why:**
- **Sites they dislike, and why:**
- **Domain status:**

## 5. Direction

The chosen direction from the design rounds, and **why the client chose it** over the others.

- Round 1 (directions): link to the artboards, and the choice made.
- Round 2 (key screens, including mobile): link.
- Round 3 (empty and error states): link.

## 6. Theme

- [ ] Light only
- [ ] Light plus a dark palette derived from it

Contrast must be checked on real backgrounds, not swatches.

## 7. Tokens

These replace the placeholders in `src/app/globals.css`. Keep the role names.

| Role                    | Token                        | Value | Notes                                 |
| ----------------------- | ---------------------------- | ----- | ------------------------------------- |
| Body text               | `--color-foreground`         |       |                                       |
| Secondary text          | `--color-muted`              |       | contrast against background and panel |
| Page background         | `--color-background`         |       |                                       |
| Large panels            | `--color-panel`              |       |                                       |
| Borders                 | `--color-border`             |       |                                       |
| Filled controls         | `--color-primary`            |       |                                       |
| Text on filled controls | `--color-primary-foreground` |       |                                       |
| Errors                  | `--color-danger`             |       |                                       |
| Success                 | `--color-success`            |       |                                       |
| Body font               | `--font-sans`                |       | self-host the files in `public/fonts` |
| Display font            | `--font-display`             |       |                                       |

Type scale, spacing scale, radii and shadows:

## 8. Components

For each component: its variants, its states (default, hover, focus, disabled, loading, error),
and accessibility notes.

- Button
- Field (input, textarea)
- Form message
- Header and navigation (desktop and mobile)
- Footer, which keeps the Talasi credit

## 9. Page inventory

Every page gets a drawing before it's built.

| Page                                       | Desktop | Mobile | Empty state | Error state    |
| ------------------------------------------ | ------- | ------ | ----------- | -------------- |
| Home                                       |         |        |             |                |
| CMS page                                   |         |        |             |                |
| Contact                                    |         |        |             | sending failed |
| Contact: sent / error (no-JS result pages) |         |        |             |                |
| 404                                        |         |        |             |                |

## 10. Sign-off

Approved by: ______ on ______ (date), via ______ (channel).

After sign-off this document is the source of truth. Where code disagrees with it, the code changes.
