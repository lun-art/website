# Arch Lunar Art Archive operations guide

A plain-English guide to running the site day to day. No coding needed. Write it as the site is
built, not at the end.

## Editing content

Go to `https://lun-art.sanity.studio` and sign in with the account you were invited with.

- **Site settings:** the site name, description, logo, default social image, contact email, the
  footer line, and the links shown in the header and footer.
- **Home page:** the two title lines, the introduction and the four numbered about blocks.
- **Artists:** each artist has a name, an address (slug), the title of their work, their website,
  their statement and images of the work. The page lives at `lun.art/artist/<slug>`. **Don't
  change the slug of a live artist**: links to the old address would break.
- **Pages:** extra pages at `lun.art/<slug>`. Tick "Show in navigation" to add one to the menu.

**Publishing rebuilds the site.** Changes appear a few minutes after you press Publish, not
instantly. Several publishes in a row are combined into one rebuild.

## Newsletter sign-ups

They join the newsletter segment in Resend (Audience). Send newsletters from Resend's Broadcasts.

## Messages from the contact form

They're emailed to [CONTACT EMAIL]. Reply directly: the reply goes to the visitor.

## Visitor numbers

PostHog (EU cloud), organization **lun-art**, project **lun.art**: Web analytics shows visits and
top pages. It's cookieless, so there's no consent banner.

## Asking for changes

Ask in the group chat. The assistant can edit content directly. Changes to how the site works
come back as a preview link to check before they go live.

## Document shapes (for the assistant)

Fixed IDs and keyed arrays, so content can be patched directly.

| Document      | `_id`                                                        | Fields                                                                                                                                                    |
| ------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Site settings | `siteSettings`                                               | `siteName`, `tagline`, `description`, `logo{asset, alt}`, `defaultSeoImage{asset, alt}`, `contactEmail`, `footerMotto`, `socialLinks[{_key, label, url}]` |
| Home page     | `home`                                                       | `titleLine1`, `titleLine2`, `intro`, `aboutBlocks[{_key, title, text}]`, `seoDescription`, `seoImage`                                                     |
| Artist        | `artist-<slug>` for imported artists, generated for new ones | `name`, `slug.current`, `workTitle`, `website`, `statement`, `works[{_key, asset, alt}]`, `seoDescription`                                                |
| Page          | generated                                                    | `title`, `slug.current`, `body[]` (blocks and `imageWithAlt`), `showInNav`, `navOrder`, `seoDescription`, `seoImage`                                      |
