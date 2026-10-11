import { defineArrayMember, defineField, defineType } from "sanity";
import { withStockPhotos } from "./stock-photos";

// A generic content page. The page with slug "home" is the homepage.
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description: 'Use "home" for the homepage.',
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "imageWithAlt", options: withStockPhotos }),
      ],
    }),
    defineField({
      name: "showInNav",
      title: "Show in navigation",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "navOrder",
      title: "Navigation order",
      type: "number",
    }),
    defineField({
      name: "seoDescription",
      title: "Search description",
      type: "text",
      rows: 2,
      validation: (rule) =>
        rule.max(160).warning("Keep it under 160 characters"),
    }),
    defineField({
      name: "seoImage",
      title: "Social image",
      type: "imageWithAlt",
      options: withStockPhotos,
    }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
