import { defineArrayMember, defineField, defineType } from "sanity";

// An artist in the archive. Listed on the home page and /artist, with a page
// of their own at /artist/<slug>. Most artists have only a name so far.
export const artist = defineType({
  name: "artist",
  title: "Artist",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description: "The page address: /artist/<slug>. Don't change it once live.",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "workTitle",
      title: "Work title",
      description: "The title of the work in the archive, under the name.",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "website",
      type: "url",
    }),
    defineField({
      name: "statement",
      description: "Line breaks are kept as written.",
      type: "text",
      rows: 12,
    }),
    defineField({
      name: "works",
      title: "Images of the work",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
    }),
    defineField({
      name: "seoDescription",
      title: "Search description",
      description:
        "Optional. Without it, the start of the statement is used, or a line naming the artist.",
      type: "text",
      rows: 2,
      validation: (rule) =>
        rule.max(160).warning("Keep it under 160 characters"),
    }),
  ],
  orderings: [
    {
      title: "Name",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  preview: { select: { title: "name", subtitle: "workTitle" } },
});
