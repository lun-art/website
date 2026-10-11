import { defineArrayMember, defineField, defineType } from "sanity";
import { withStockPhotos } from "./stock-photos";

// Singleton with the fixed _id "home": the copy on the home page that isn't
// an artist.
export const home = defineType({
  name: "home",
  title: "Home page",
  type: "document",
  fields: [
    defineField({
      name: "titleLine1",
      title: "Title, first line",
      description: "Set in the serif face, e.g. Arch Lunar.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleLine2",
      title: "Title, second line",
      description: "Set in the sans face, e.g. Art Archive.",
      type: "string",
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      description: "The paragraph under the title.",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "aboutBlocks",
      title: "About blocks",
      description:
        "The numbered blocks under the artist list. Four fill the grid.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "aboutBlock",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "text",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "seoDescription",
      title: "Search description",
      description: "Optional. The introduction is used without it.",
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
  preview: { prepare: () => ({ title: "Home page" }) },
});
