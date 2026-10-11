# [SITE NAME] operations guide

A plain-English guide to running the site day to day. No coding needed. Write it as the site is
built, not at the end.

## Editing content

Go to `https://[STUDIO HOST].sanity.studio` and sign in with the account you were invited with.

- **Site settings:** the site name, tagline, description, logo, default social image, contact
  email and social links.
- **Pages:** each page has a title, an address (slug) and its content. The page with the address
  `home` is the homepage. Tick "Show in navigation" to add a page to the menu.

**Publishing rebuilds the site.** Changes appear a few minutes after you press Publish, not
instantly. Several publishes in a row are combined into one rebuild.

## Messages from the contact form

They're emailed to [CONTACT EMAIL]. Reply directly: the reply goes to the visitor.

## Asking for changes

Ask in the group chat. The assistant can edit content directly. Changes to how the site works
come back as a preview link to check before they go live.

## Document shapes (for the assistant)

Fixed IDs and keyed arrays, so content can be patched directly.

| Document      | `_id`          | Fields                                                                                                                                     |
| ------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Site settings | `siteSettings` | `siteName`, `tagline`, `description`, `logo{asset, alt}`, `defaultSeoImage{asset, alt}`, `contactEmail`, `socialLinks[{_key, label, url}]` |
| Page          | generated      | `title`, `slug.current`, `body[]` (blocks and `imageWithAlt`), `showInNav`, `navOrder`, `seoDescription`, `seoImage`                       |
