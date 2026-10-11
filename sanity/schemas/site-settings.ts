import { defineArrayMember, defineField, defineType } from "sanity";
import { withStockPhotos } from "./stock-photos";

// Singleton with the fixed _id "siteSettings" (see sanity.config.ts), so the
// client's agent can patch it directly.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      description:
        "A few words on what the business does. Follows the site name in the homepage title.",
      type: "string",
      validation: (rule) => rule.max(40).warning("Keep it under 40 characters"),
    }),
    defineField({
      name: "description",
      title: "Default description",
      description: "Used in search results and link previews.",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "logo", title: "Logo", type: "imageWithAlt" }),
    defineField({
      name: "defaultSeoImage",
      title: "Default social image",
      description: "Shown when a page has no image of its own. 1200×630.",
      type: "imageWithAlt",
      options: withStockPhotos,
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "footerMotto",
      title: "Footer line",
      description: "The line under the links in the footer.",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      description: "Shown in the header and the footer, in this order.",
      title: "Social links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "url", type: "url" }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
