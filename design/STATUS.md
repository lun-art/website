# Design status

Updated: 2026-10-11

## Waiting on the owner

- Artwork images: none exist yet. Add them per artist in the Studio (`Images of the work`).
- The empty artist pages (118 of 134 have only a name): fill in or leave as they are.

## Decided

| Date       | Decision                                              | Why                                              |
| ---------- | ----------------------------------------------------- | ------------------------------------------------ |
| 2026-10-11 | Port the live design 1:1 to the Astro template        | The live site is the approved direction          |
| 2026-10-11 | No Talasi credit in the footer                        | Owner's choice                                   |
| 2026-10-11 | Keep the template's contact page, linked from the nav | Owner's choice                                   |
| 2026-10-11 | Newsletter moves from Mailchimp to a Resend segment   | One email provider with the contact form         |
| 2026-10-11 | Run PostHog and Google Tag Manager side by side       | Keep the existing GTM setup while adding PostHog |
| 2026-10-11 | Artists sorted by name, ignoring case                 | "ouchhh" now files under O, before Olammy        |

## Known gaps

- Google Tag Manager sets cookies, so the site needs a consent banner for EU visitors while it's
  on. There isn't one.
- The newsletter has no double opt-in: anyone can sign up any address. The Mailchimp form behaved
  the same way.
- `og.png` is the name on the dark ground; the old site used the moon photograph.
